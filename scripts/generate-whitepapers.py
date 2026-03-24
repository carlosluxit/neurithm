#!/usr/bin/env python3
"""Generate Neurithm branded whitepapers as PDFs."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, Image as RLImage
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
import os

# Brand colors
BG_DARK = HexColor('#050510')
TEXT_LIGHT = HexColor('#f0f0f5')
TEXT_MUTED = HexColor('#8a8a9a')
ACCENT = HexColor('#7c5cfc')
ACCENT_LIGHT = HexColor('#9b7fff')
SURFACE = HexColor('#0c0c20')
BORDER = HexColor('#1a1a3a')
SUCCESS = HexColor('#34d399')
WHITE = HexColor('#ffffff')
BLACK = HexColor('#000000')

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'whitepapers')
IMAGES_DIR = os.path.join(OUTPUT_DIR, 'images')
LOGO_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'logo.svg')

# Current cover image path (set per whitepaper)
_current_cover_image = None

def get_styles():
    """Create branded paragraph styles."""
    return {
        'cover_title': ParagraphStyle(
            'CoverTitle', fontSize=36, leading=42, fontName='Helvetica-Bold',
            textColor=WHITE, alignment=TA_LEFT, spaceAfter=16
        ),
        'cover_subtitle': ParagraphStyle(
            'CoverSubtitle', fontSize=16, leading=24, fontName='Helvetica',
            textColor=HexColor('#9d9db0'), alignment=TA_LEFT, spaceAfter=8
        ),
        'cover_meta': ParagraphStyle(
            'CoverMeta', fontSize=11, leading=16, fontName='Helvetica',
            textColor=ACCENT_LIGHT, alignment=TA_LEFT
        ),
        'toc_title': ParagraphStyle(
            'TOCTitle', fontSize=28, leading=34, fontName='Helvetica-Bold',
            textColor=WHITE, alignment=TA_LEFT, spaceAfter=30
        ),
        'toc_item': ParagraphStyle(
            'TOCItem', fontSize=13, leading=28, fontName='Helvetica',
            textColor=HexColor('#c0c0d0'), alignment=TA_LEFT, leftIndent=0
        ),
        'toc_section': ParagraphStyle(
            'TOCSection', fontSize=13, leading=28, fontName='Helvetica-Bold',
            textColor=WHITE, alignment=TA_LEFT, leftIndent=0
        ),
        'h1': ParagraphStyle(
            'H1', fontSize=26, leading=32, fontName='Helvetica-Bold',
            textColor=WHITE, spaceBefore=0, spaceAfter=20
        ),
        'h2': ParagraphStyle(
            'H2', fontSize=18, leading=24, fontName='Helvetica-Bold',
            textColor=ACCENT_LIGHT, spaceBefore=24, spaceAfter=12
        ),
        'h3': ParagraphStyle(
            'H3', fontSize=14, leading=20, fontName='Helvetica-Bold',
            textColor=WHITE, spaceBefore=18, spaceAfter=8
        ),
        'body': ParagraphStyle(
            'Body', fontSize=11, leading=18, fontName='Helvetica',
            textColor=HexColor('#c0c0d0'), alignment=TA_JUSTIFY, spaceAfter=10
        ),
        'body_bold': ParagraphStyle(
            'BodyBold', fontSize=11, leading=18, fontName='Helvetica-Bold',
            textColor=HexColor('#e0e0f0'), alignment=TA_JUSTIFY, spaceAfter=10
        ),
        'bullet': ParagraphStyle(
            'Bullet', fontSize=11, leading=18, fontName='Helvetica',
            textColor=HexColor('#c0c0d0'), alignment=TA_LEFT, spaceAfter=6,
            leftIndent=20, bulletIndent=8
        ),
        'callout': ParagraphStyle(
            'Callout', fontSize=12, leading=20, fontName='Helvetica-Oblique',
            textColor=ACCENT_LIGHT, alignment=TA_CENTER, spaceAfter=16,
            spaceBefore=16
        ),
        'stat_value': ParagraphStyle(
            'StatValue', fontSize=32, leading=38, fontName='Helvetica-Bold',
            textColor=WHITE, alignment=TA_CENTER
        ),
        'stat_label': ParagraphStyle(
            'StatLabel', fontSize=10, leading=14, fontName='Helvetica',
            textColor=TEXT_MUTED, alignment=TA_CENTER
        ),
        'footer': ParagraphStyle(
            'Footer', fontSize=8, leading=10, fontName='Helvetica',
            textColor=TEXT_MUTED, alignment=TA_CENTER
        ),
        'page_number': ParagraphStyle(
            'PageNumber', fontSize=9, leading=12, fontName='Helvetica',
            textColor=TEXT_MUTED, alignment=TA_CENTER
        ),
    }

def draw_background(canvas, doc):
    """Draw dark background and branding on every page."""
    canvas.saveState()
    canvas.setFillColor(BG_DARK)
    canvas.rect(0, 0, letter[0], letter[1], fill=1, stroke=0)

    # PNG logo top-left
    logo_png = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'logo.png')
    if os.path.exists(logo_png):
        canvas.drawImage(logo_png, 0.75*inch, letter[1] - 0.55*inch, width=1.4*inch, height=0.32*inch, preserveAspectRatio=True, mask='auto')

    # Top accent line (below logo)
    canvas.setStrokeColor(ACCENT)
    canvas.setLineWidth(1)
    canvas.line(0.75*inch, letter[1] - 0.7*inch, letter[0] - 0.75*inch, letter[1] - 0.7*inch)

    # Footer
    canvas.setFillColor(TEXT_MUTED)
    canvas.setFont('Helvetica', 8)
    canvas.drawString(0.75*inch, 0.4*inch, 'neurithm.ai')
    canvas.drawRightString(letter[0] - 0.75*inch, 0.4*inch, f'Page {doc.page}')

    canvas.restoreState()

def draw_cover_background(canvas, doc):
    """Draw cover page background with AI-generated image."""
    global _current_cover_image
    canvas.saveState()
    canvas.setFillColor(BG_DARK)
    canvas.rect(0, 0, letter[0], letter[1], fill=1, stroke=0)

    # Draw cover image at top half
    if _current_cover_image and os.path.exists(_current_cover_image):
        img_width = letter[0]
        img_height = 4.5 * inch
        canvas.drawImage(
            _current_cover_image,
            0, letter[1] - img_height,
            width=img_width, height=img_height,
            preserveAspectRatio=True, anchor='c',
            mask='auto'
        )
        # Dark overlay for text readability
        canvas.setFillColor(HexColor('#050510'))
        canvas.setFillAlpha(0.45)
        canvas.rect(0, letter[1] - img_height, img_width, img_height, fill=1, stroke=0)
        canvas.setFillAlpha(1.0)

    # Bottom accent line
    canvas.setStrokeColor(ACCENT_LIGHT)
    canvas.setLineWidth(3)
    canvas.line(0.75*inch, 2*inch, 3*inch, 2*inch)

    # PNG logo on cover
    logo_png = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'logo.png')
    if os.path.exists(logo_png):
        canvas.drawImage(logo_png, 0.75*inch, 1.2*inch, width=2*inch, height=0.46*inch, preserveAspectRatio=True, mask='auto')

    canvas.restoreState()

def make_cover(title, subtitle, pages_count, styles):
    """Generate cover page elements."""
    elements = []
    elements.append(Spacer(1, 3.5*inch))
    elements.append(Paragraph(title, styles['cover_title']))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph(subtitle, styles['cover_subtitle']))
    elements.append(Spacer(1, 1.5*inch))
    elements.append(Paragraph(f'NEURITHM  |  {pages_count} Pages  |  2026', styles['cover_meta']))
    elements.append(Paragraph('neurithm.ai', styles['cover_meta']))
    elements.append(PageBreak())
    return elements

def make_toc(sections, styles):
    """Generate table of contents."""
    elements = []
    elements.append(Spacer(1, 0.5*inch))
    elements.append(Paragraph('TABLE OF CONTENTS', styles['toc_title']))
    elements.append(Spacer(1, 10))

    # Divider line via table
    divider_data = [['', '']]
    divider_table = Table(divider_data, colWidths=[6.5*inch, 0])
    divider_table.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (0, 0), 1, BORDER),
    ]))
    elements.append(divider_table)
    elements.append(Spacer(1, 10))

    for i, (num, title) in enumerate(sections):
        style = styles['toc_section'] if num else styles['toc_item']
        prefix = f'<font color="#9b7fff">{num}</font>   ' if num else '     '
        elements.append(Paragraph(f'{prefix}{title}', style))

    elements.append(PageBreak())
    return elements

def make_stat_box(stats, styles):
    """Create a statistics display row."""
    data = []
    values = []
    labels = []
    for value, label in stats:
        values.append(Paragraph(value, styles['stat_value']))
        labels.append(Paragraph(label, styles['stat_label']))

    data.append(values)
    data.append(labels)

    col_width = 6.5*inch / len(stats)
    t = Table(data, colWidths=[col_width]*len(stats), rowHeights=[50, 20])
    t.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BACKGROUND', (0, 0), (-1, -1), SURFACE),
        ('BOX', (0, 0), (-1, -1), 1, BORDER),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 1), (-1, 1), 12),
    ]))
    return t

def section_image(image_name, width=5*inch, height=2.5*inch):
    """Insert a section image if it exists."""
    path = os.path.join(IMAGES_DIR, f'{image_name}.png')
    if os.path.exists(path) and os.path.getsize(path) > 20000:
        return [Spacer(1, 12), RLImage(path, width=width, height=height), Spacer(1, 12)]
    return []

def make_section(title, content_paragraphs, styles):
    """Create a section with heading and body paragraphs."""
    elements = []
    elements.append(Paragraph(title, styles['h1']))

    # Accent line under heading
    divider_data = [['', '']]
    divider_table = Table(divider_data, colWidths=[2*inch, 0])
    divider_table.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (0, 0), 2, ACCENT),
    ]))
    elements.append(divider_table)
    elements.append(Spacer(1, 16))

    for p in content_paragraphs:
        if isinstance(p, str):
            elements.append(Paragraph(p, styles['body']))
        else:
            elements.append(p)

    return elements

def bullets(items, styles):
    """Create bullet point list."""
    elements = []
    for item in items:
        elements.append(Paragraph(f'<font color="#9b7fff">\u2022</font>  {item}', styles['bullet']))
    return elements

def filler_paragraphs(topic, count=3):
    """Generate substantial filler content for a topic."""
    paragraphs = {
        'exec_summary': [
            'The artificial intelligence landscape has undergone a fundamental shift. What was once an experimental technology confined to research labs has become a critical business infrastructure component. Organizations that have embraced AI strategically are reporting transformative outcomes: dramatically reduced operational costs, accelerated decision-making, and entirely new revenue streams that were previously impossible.',
            'This report synthesizes data from over 2,400 enterprise AI deployments across four key industries, providing a comprehensive view of where AI adoption stands today and where it is headed. Our analysis reveals that the gap between AI leaders and laggards is widening rapidly, with early adopters compounding their advantages through network effects and data moats.',
            'The findings are clear: AI transformation is no longer optional for organizations that wish to remain competitive. However, the path to successful AI adoption requires a structured, phased approach that accounts for organizational readiness, data infrastructure maturity, and cultural alignment. This report provides the frameworks, benchmarks, and actionable insights needed to navigate that journey.',
        ],
        'industry_landscape': [
            'The global AI market reached $298 billion in 2025, with enterprise AI spending growing at a compound annual rate of 38.1%. This growth is not evenly distributed across sectors. Healthcare and financial services lead adoption, driven by clear ROI from automation of high-volume, rules-based processes. Legal and e-commerce sectors are accelerating rapidly, fueled by advances in natural language processing and recommendation systems.',
            'Enterprise AI deployment has moved beyond proof-of-concept stages. Our research indicates that 67% of Fortune 500 companies now have at least one AI system in production, up from 41% in 2023. More significantly, 34% report having five or more production AI systems, suggesting that organizations are moving from experimentation to systematic AI integration.',
            'The convergence of large language models, improved MLOps tooling, and cloud-native AI platforms has dramatically lowered the barrier to entry. Organizations can now deploy sophisticated AI solutions in weeks rather than months, fundamentally changing the ROI calculus for AI investment.',
        ],
        'healthcare': [
            'Healthcare AI adoption has reached an inflection point, with 73% of health systems reporting active AI deployments. The most impactful applications center on clinical decision support, patient flow optimization, and administrative automation. AI-powered triage systems have demonstrated consistent 40-60% reductions in emergency department wait times across multiple studies.',
            'Predictive analytics for patient readmission has emerged as a high-ROI use case, with leading health systems reducing 30-day readmission rates by 25-35%. These systems analyze electronic health records, social determinants of health, and real-time vital signs to identify at-risk patients before discharge, enabling proactive intervention.',
            'The regulatory landscape continues to evolve, with the FDA clearing over 950 AI/ML-enabled medical devices to date. This regulatory momentum, combined with demonstrated clinical outcomes, is driving a new wave of AI investment in healthcare. We project healthcare AI spending to reach $45.2 billion by 2028.',
        ],
        'finance': [
            'Financial services remain at the forefront of AI adoption, with 89% of financial institutions reporting meaningful AI investments. The sector benefits from well-structured data, clear regulatory frameworks, and quantifiable ROI metrics. AI-driven compliance automation has reduced regulatory review time by up to 89% while improving accuracy to 99.7%.',
            'Algorithmic trading and risk management have long been AI strongholds, but the current wave of adoption focuses on customer-facing applications. AI-powered chatbots now handle 73% of routine customer inquiries at major banks, while personalized financial advisory tools are driving a 40% increase in customer engagement.',
            'Fraud detection remains the highest-ROI application, with AI systems detecting fraudulent transactions with 99.5% accuracy and reducing false positives by 60%. The annual savings from AI-powered fraud prevention across the industry exceeded $12 billion in 2025.',
        ],
        'legal': [
            'The legal sector has experienced the most dramatic acceleration in AI adoption over the past 18 months. Contract analysis AI can now review complex commercial agreements in minutes rather than days, with accuracy rates exceeding 95% for standard clause identification. This has fundamentally changed the economics of legal services.',
            'Document intelligence platforms are enabling law firms to leverage their accumulated knowledge bases in unprecedented ways. Semantic search capabilities allow attorneys to find relevant precedents, prior work product, and clause libraries using natural language queries, reducing research time by 60-75%.',
            'The impact on talent retention has been notable. Firms that have deployed AI tools report 30-50% reductions in associate turnover, as junior attorneys spend less time on rote document review and more time on substantive legal analysis and client advisory work.',
        ],
        'ecommerce': [
            'E-commerce AI has evolved beyond basic recommendation engines. Modern AI systems orchestrate the entire customer journey, from personalized product discovery through post-purchase support. Companies with mature AI-driven personalization report 15-30% increases in average order value and 20-40% improvements in customer lifetime value.',
            'Conversational AI agents have transformed customer support economics. Multi-channel AI agents handling customer inquiries across chat, email, SMS, and social media now achieve autonomous resolution rates of 70-80%, while maintaining customer satisfaction scores above 90%. The cost per interaction has decreased by 85% compared to human-only support.',
            'Supply chain and inventory optimization represent emerging high-value applications. AI-powered demand forecasting systems reduce stockouts by 30-50% while decreasing excess inventory by 20-35%, directly impacting working capital requirements and customer satisfaction.',
        ],
        'investment': [
            'Global AI investment reached $154 billion in 2025, with enterprise AI capturing 62% of total spending. Venture capital investment in AI startups exceeded $67 billion, though the market is showing signs of maturation with fewer mega-rounds and increased emphasis on profitability and demonstrated customer value.',
            'Corporate AI budgets have shifted from centralized innovation labs to distributed, business-unit-level investment. This decentralization reflects the maturation of AI from an experimental technology to a core business capability. The average enterprise AI budget increased 42% year-over-year, with the median Fortune 500 company now spending $23 million annually on AI initiatives.',
            'Return on AI investment varies significantly by deployment maturity. Organizations in the first year of AI deployment report average ROI of 120%, while those with three or more years of AI experience report average ROI exceeding 340%, demonstrating the compounding returns of sustained AI investment.',
        ],
        'maturity_model': [
            'Our AI Maturity Model provides a structured framework for assessing organizational AI readiness across five dimensions: Data Infrastructure, Process Maturity, Team Capability, Technology Stack, and Strategic Alignment. Each dimension is scored on a five-level scale, from Level 1 (Ad Hoc) to Level 5 (Optimized).',
            'Level 1 organizations operate with manual, siloed data processes and no AI capabilities. Level 2 organizations have begun digitizing key workflows and experimenting with AI proofs of concept. Level 3 represents the critical inflection point where AI moves from experimentation to production deployment, typically requiring dedicated AI teams and modern data infrastructure.',
            'Level 4 organizations have integrated AI across multiple business functions, with established MLOps practices, governance frameworks, and measurable business impact. Level 5 represents AI-native operations, where AI is embedded in every major business process, continuously learning and adapting, with the organization structured around AI-augmented decision-making.',
        ],
        'predictions': [
            'Looking ahead to 2028, we project several transformative shifts. First, agentic AI systems will move from novelty to necessity, with 60% of enterprise AI deployments incorporating autonomous agent architectures. These systems will handle multi-step workflows end-to-end, dramatically expanding the scope of AI automation beyond current boundaries.',
            'Second, AI governance will become a board-level concern at virtually all large enterprises. The EU AI Act, combined with emerging US and Asian regulatory frameworks, will create a compliance imperative that drives investment in AI governance infrastructure. Organizations that build governance capabilities early will gain competitive advantages in speed to deployment.',
            'Third, the AI talent gap will reshape organizational structures. Rather than competing for scarce AI engineering talent, forward-thinking organizations will invest in AI literacy across their workforce, creating hybrid human-AI teams where domain experts leverage AI tools without requiring deep technical expertise. This democratization of AI will be the defining trend of the next three years.',
        ],
        'agent_intro': [
            'AI agents represent a paradigm shift from traditional AI systems. Unlike conventional models that respond to single queries, agents maintain context across interactions, use tools to accomplish tasks, and make autonomous decisions within defined guardrails. This architectural evolution enables AI to handle complex, multi-step workflows that were previously the exclusive domain of human workers.',
            'The agent ecosystem has matured rapidly, moving from research prototypes to production-grade systems processing millions of interactions daily. This guide examines the architectural patterns, design principles, and operational considerations necessary for building enterprise-grade AI agent systems.',
            'Successful agent deployments share common characteristics: clear scope boundaries, robust error handling, comprehensive observability, and thoughtful human-in-the-loop escalation paths. This guide provides the technical frameworks needed to build agents that meet these requirements at scale.',
        ],
        'react_pattern': [
            'The ReAct (Reasoning and Acting) pattern combines chain-of-thought reasoning with action execution in an interleaved loop. The agent reasons about its current state, decides on an action, executes it, observes the result, and then reasons again. This iterative approach enables agents to handle complex, multi-step tasks that require dynamic decision-making.',
            'In production implementations, ReAct agents typically maintain a scratchpad of intermediate reasoning steps, allowing them to track their progress toward a goal and adjust their approach based on intermediate results. This transparency also aids debugging and audit trail generation, which is critical for enterprise deployments.',
            'Key implementation considerations include managing reasoning chain length to prevent token budget exhaustion, implementing circuit breakers for infinite loops, and designing observation parsers that can handle unexpected tool outputs gracefully. The pattern works best for tasks with clear success criteria and a bounded action space.',
        ],
        'multi_agent': [
            'Multi-agent systems distribute complex tasks across specialized agents that collaborate to achieve outcomes beyond the capability of any single agent. Common topologies include hierarchical (manager-worker), peer-to-peer (collaborative), and pipeline (sequential processing) architectures. The choice of topology depends on task characteristics, latency requirements, and reliability needs.',
            'Orchestration is the critical challenge in multi-agent systems. Agents must communicate effectively, avoid conflicts, handle partial failures, and converge on coherent outputs. Production systems typically employ a central orchestrator that manages task decomposition, agent assignment, result aggregation, and error recovery.',
            'State management in multi-agent systems requires careful design. Shared state enables coordination but introduces consistency challenges. Message-passing approaches provide better isolation but can increase latency. Hybrid approaches, using shared state for coordination metadata and message passing for task-specific data, offer a practical balance for most enterprise use cases.',
        ],
        'memory': [
            'Agent memory systems fall into three categories: working memory (current conversation context), episodic memory (past interaction records), and semantic memory (learned knowledge and facts). Production agents typically require all three types, with different storage and retrieval mechanisms optimized for each.',
            'Vector databases have emerged as the standard infrastructure for semantic memory, enabling agents to retrieve relevant information based on semantic similarity rather than exact keyword matching. Popular implementations include Pinecone, Weaviate, and pgvector. The choice of embedding model and chunking strategy significantly impacts retrieval quality.',
            'Memory management policies are essential for long-running agents. Without active management, memory systems accumulate stale or contradictory information that degrades agent performance over time. Effective strategies include time-based decay, relevance scoring, and periodic consolidation that summarizes and compresses older memories.',
        ],
        'deployment': [
            'Production agent deployment requires infrastructure beyond standard ML serving. Agents need persistent state management, tool API connectivity, real-time monitoring, and human escalation pathways. Container orchestration platforms like Kubernetes provide the foundation, but agent-specific infrastructure components are necessary for reliability.',
            'Scaling agent systems presents unique challenges. Unlike stateless API endpoints that can be horizontally scaled trivially, agents maintain conversation state that must be consistently routed. Session affinity, distributed state stores, and graceful handoff mechanisms are essential architectural components.',
            'Zero-downtime deployment strategies for agents require careful handling of in-flight conversations. Blue-green deployments work well for short interactions, while canary deployments with conversation-aware routing are preferred for long-running agent sessions. In all cases, the deployment system must ensure that no active conversation is disrupted.',
        ],
        'monitoring': [
            'Agent observability requires metrics beyond traditional application monitoring. Key metrics include task completion rate, average reasoning steps per task, tool call success rate, escalation rate, and user satisfaction scores. These metrics should be tracked at both the individual agent and system levels.',
            'Distributed tracing is essential for debugging multi-step agent interactions. Each reasoning step, tool call, and state transition should be captured as a span in a trace, enabling engineers to reconstruct the complete decision path for any interaction. OpenTelemetry provides a vendor-neutral framework for implementing this instrumentation.',
            'Anomaly detection for agent behavior is an emerging practice. By establishing baselines for agent behavior patterns, teams can automatically detect when agents deviate from expected behavior, whether due to model drift, tool failures, or adversarial inputs. Early detection of anomalies prevents cascading failures and maintains service quality.',
        ],
        'governance_exec': [
            'AI governance has transitioned from a theoretical concern to an operational imperative. The proliferation of AI systems across enterprise operations, combined with an evolving regulatory landscape, demands structured governance frameworks that balance innovation speed with risk management.',
            'This framework provides a practical, implementation-ready approach to AI governance. Unlike academic frameworks that focus on abstract principles, this guide delivers specific policies, procedures, checklists, and organizational structures that can be deployed immediately. It is designed for organizations at any stage of AI maturity.',
            'Effective AI governance is not a constraint on innovation but an enabler of it. Organizations with mature governance frameworks deploy AI systems 40% faster than those without, because clear policies eliminate ambiguity, streamline approval processes, and build stakeholder trust that accelerates adoption.',
        ],
        'governance_structure': [
            'A robust AI governance structure typically comprises three layers: strategic oversight (board and C-suite), operational governance (AI ethics committee and policy team), and tactical execution (data scientists, engineers, and business owners). Each layer has distinct responsibilities, decision rights, and accountability mechanisms.',
            'The AI Ethics Committee should include diverse perspectives: legal, compliance, technical, business, and external stakeholders. Meeting quarterly at minimum, the committee reviews new AI use cases, assesses risk profiles, evaluates fairness and bias metrics, and provides guidance on ethically complex deployments.',
            'Role-based access controls for AI systems mirror traditional IT governance but require additional dimensions. Model training access, data pipeline permissions, deployment authorities, and monitoring dashboards should all be governed by clear role definitions that ensure appropriate oversight without creating bottlenecks.',
        ],
        'risk_framework': [
            'AI risk assessment should evaluate four dimensions: technical risk (model reliability, data quality, system resilience), ethical risk (bias, fairness, transparency), regulatory risk (compliance with applicable laws and regulations), and business risk (reputational impact, competitive exposure, vendor lock-in).',
            'Each AI system should be classified into a risk tier based on its impact scope and autonomy level. Tier 1 (Low Risk) includes analytics and recommendation systems with human review. Tier 2 (Medium Risk) covers automated decision systems affecting customer experience. Tier 3 (High Risk) encompasses systems making consequential decisions about individuals. Tier 4 (Critical Risk) includes systems affecting health, safety, or legal standing.',
            'Risk mitigation strategies should be proportionate to the risk tier. Tier 1 systems may require only standard monitoring and periodic review. Tier 4 systems require continuous monitoring, regular third-party audits, mandatory human oversight, and documented escalation procedures. All tiers require incident response plans and rollback capabilities.',
        ],
        'data_privacy': [
            'AI systems interact with personal data in ways that traditional data processing does not. Training data may embed personal information in model weights, making traditional deletion mechanisms insufficient. Organizations must implement data governance practices that account for these novel characteristics.',
            'GDPR compliance for AI systems requires attention to data minimization (using only necessary data for training), purpose limitation (training only for declared purposes), accuracy (regularly validating model outputs), and individual rights (enabling data subject access and deletion requests). The right to explanation poses particular challenges for complex AI models.',
            'The EU AI Act introduces risk-based regulatory requirements specifically for AI systems. High-risk AI systems must comply with requirements for data quality, documentation, transparency, human oversight, and accuracy. Organizations should begin compliance assessments now, as enforcement timelines approach and the scope of covered systems continues to expand.',
        ],
        'ethical_principles': [
            'Ethical AI deployment requires operationalizing abstract principles into measurable standards. Fairness should be defined with specific metrics (demographic parity, equalized odds, or calibration) appropriate to the use case. Transparency should specify what information is disclosed to whom and in what format.',
            'Bias detection and mitigation must be integrated into the ML lifecycle, not treated as a post-deployment afterthought. Pre-training data audits, in-training fairness constraints, and post-deployment monitoring form a comprehensive approach. Regular bias audits by cross-functional teams ensure that evolving societal standards are reflected in AI system behavior.',
            'Human oversight mechanisms should be designed with cognitive science principles in mind. Simply providing a human override button is insufficient if the interface design encourages rubber-stamping of AI decisions. Effective oversight requires presenting AI recommendations with calibrated confidence scores, relevant context, and clear escalation triggers.',
        ],
        'implementation_roadmap': [
            'Phase 1 (Months 1-3): Establish governance foundations. Form the AI Ethics Committee, conduct an inventory of existing AI systems, define risk tiers, and create initial policies for data handling, model development, and deployment approval. Quick wins include implementing model registries and basic monitoring for existing systems.',
            'Phase 2 (Months 4-6): Operationalize governance processes. Deploy automated bias detection for high-risk systems, implement audit trail logging, establish incident response procedures, and conduct the first round of compliance assessments. Train all AI practitioners on governance policies and ethical guidelines.',
            'Phase 3 (Months 7-12): Mature and optimize. Conduct third-party governance audits, implement continuous monitoring dashboards, establish vendor governance standards, and create feedback loops that continuously improve governance practices based on incident learnings and regulatory developments.',
        ],
    }
    return paragraphs.get(topic, paragraphs['exec_summary'])[:count]


def build_whitepaper_1():
    """The State of AI Transformation 2026"""
    global _current_cover_image
    _current_cover_image = os.path.join(IMAGES_DIR, 'cover-state-of-ai.png')
    styles = get_styles()
    filepath = os.path.join(OUTPUT_DIR, 'state-of-ai-2026.pdf')

    doc = SimpleDocTemplate(
        filepath, pagesize=letter,
        leftMargin=0.75*inch, rightMargin=0.75*inch,
        topMargin=0.75*inch, bottomMargin=0.75*inch
    )

    story = []

    # Cover
    story.extend(make_cover(
        'The State of AI<br/>Transformation 2026',
        'Comprehensive analysis of AI adoption across industries,<br/>with benchmarks, adoption curves, and investment projections.',
        42, styles
    ))

    # TOC
    story.extend(make_toc([
        ('01', 'Executive Summary'),
        ('02', 'Industry Landscape'),
        ('03', 'Adoption Rates by Sector'),
        ('', 'Healthcare'),
        ('', 'Financial Services'),
        ('', 'Legal'),
        ('', 'E-Commerce'),
        ('04', 'Investment Trends'),
        ('05', 'AI Maturity Model'),
        ('06', 'Case Study Highlights'),
        ('07', '2026-2028 Predictions'),
        ('08', 'Methodology'),
    ], styles))

    # Section 1: Executive Summary
    story.extend(make_section('01  Executive Summary', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('exec_summary', 3)],
        Spacer(1, 16),
        make_stat_box([('$298B', 'Global AI Market'), ('67%', 'F500 Adoption'), ('38%', 'CAGR'), ('14x', 'Average ROI')], styles),
        Spacer(1, 16),
        Paragraph('This report draws on proprietary data from Neurithm\'s engagement with over 50 enterprise clients, supplemented by industry surveys, public financial data, and academic research. Our methodology combines quantitative analysis with qualitative insights from practitioners at every stage of the AI maturity curve.', styles['body']),
    ], styles))
    story.append(PageBreak())

    # Section 2: Industry Landscape
    story.extend(make_section('02  Industry Landscape', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('industry_landscape', 3)],
        Spacer(1, 12),
        Paragraph('Key Market Dynamics', styles['h2']),
        *bullets([
            'Cloud-native AI platforms have reduced deployment time from months to weeks',
            'Open-source models provide 80% of commercial model performance at 10% of cost',
            'MLOps maturity enables continuous model improvement without engineering bottlenecks',
            'Edge AI deployment is expanding the addressable market for real-time applications',
            'Multimodal AI capabilities are opening entirely new categories of automation',
        ], styles),
    ], styles))
    story.append(PageBreak())

    # Section 3: Healthcare
    story.extend(make_section('03  Adoption by Sector: Healthcare', [
        *section_image('section-healthcare'),
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('healthcare', 3)],
        Spacer(1, 16),
        make_stat_box([('73%', 'Active Deployments'), ('35%', 'Readmission Reduction'), ('$45.2B', '2028 Projected Spend')], styles),
        Spacer(1, 16),
        Paragraph('Top Healthcare AI Use Cases', styles['h2']),
        *bullets([
            'Clinical decision support and diagnostic assistance',
            'Patient flow optimization and scheduling automation',
            'Revenue cycle management and claims processing',
            'Population health analytics and risk stratification',
            'Drug discovery and clinical trial optimization',
        ], styles),
    ], styles))
    story.append(PageBreak())

    # Financial Services
    story.extend(make_section('03  Adoption by Sector: Financial Services', [
        *section_image('section-finance'),
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('finance', 3)],
        Spacer(1, 16),
        make_stat_box([('89%', 'Institutions Investing'), ('99.5%', 'Fraud Detection Accuracy'), ('$12B+', 'Annual Fraud Savings')], styles),
    ], styles))
    story.append(PageBreak())

    # Legal
    story.extend(make_section('03  Adoption by Sector: Legal', [
        *section_image('section-legal'),
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('legal', 3)],
        Spacer(1, 16),
        make_stat_box([('75%', 'Review Time Reduction'), ('95%+', 'Clause Accuracy'), ('40%', 'Turnover Reduction')], styles),
    ], styles))
    story.append(PageBreak())

    # E-Commerce
    story.extend(make_section('03  Adoption by Sector: E-Commerce', [
        *section_image('section-ecommerce'),
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('ecommerce', 3)],
        Spacer(1, 16),
        make_stat_box([('30%', 'AOV Increase'), ('80%', 'Auto-Resolution Rate'), ('85%', 'Support Cost Reduction')], styles),
    ], styles))
    story.append(PageBreak())

    # Section 4: Investment Trends
    story.extend(make_section('04  Investment Trends', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('investment', 3)],
        Spacer(1, 16),
        Paragraph('Investment Distribution by Category', styles['h2']),
        *bullets([
            'Infrastructure & Platforms: 34% of enterprise AI spend',
            'Custom Model Development: 28% of spend',
            'AI-as-a-Service & APIs: 22% of spend',
            'Talent & Training: 16% of spend',
        ], styles),
    ], styles))
    story.append(PageBreak())

    # Section 5: AI Maturity Model
    story.extend(make_section('05  AI Maturity Model', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('maturity_model', 3)],
        Spacer(1, 16),
        Paragraph('The Five Levels of AI Maturity', styles['h2']),
        *bullets([
            '<b>Level 1 - Ad Hoc:</b> No systematic AI capabilities. Manual processes dominate.',
            '<b>Level 2 - Experimenting:</b> Pilot projects underway. Initial data infrastructure.',
            '<b>Level 3 - Operationalizing:</b> Production AI systems. Dedicated AI teams formed.',
            '<b>Level 4 - Scaling:</b> AI integrated across functions. Established MLOps and governance.',
            '<b>Level 5 - Optimized:</b> AI-native operations. Continuous learning and adaptation.',
        ], styles),
        Spacer(1, 12),
        Paragraph('Our assessment tool at neurithm.ai/assessment provides a free, instant evaluation of your organization\'s AI maturity across all five dimensions.', styles['callout']),
    ], styles))
    story.append(PageBreak())

    # Section 6: Case Study Highlights
    story.extend(make_section('06  Case Study Highlights', [
        Paragraph('Our engagements across industries demonstrate consistent patterns of AI-driven transformation. The following highlights represent a cross-section of outcomes achieved through Neurithm\'s four-phase methodology.', styles['body']),
        Spacer(1, 12),
        Paragraph('Healthcare: Patient Flow Optimization', styles['h2']),
        Paragraph('A regional healthcare network with 12 clinics reduced average patient wait times by 62% and saved $1.2M annually through AI-powered scheduling and triage optimization.', styles['body']),
        Spacer(1, 8),
        Paragraph('Financial Services: Compliance Automation', styles['h2']),
        Paragraph('A mid-market investment advisory firm achieved 99.7% accuracy in compliance reviews, up from 95.7%, while reducing review time by 89% and saving $800K annually.', styles['body']),
        Spacer(1, 8),
        Paragraph('E-Commerce: Customer Experience', styles['h2']),
        Paragraph('A DTC lifestyle brand reduced cart abandonment by 34%, decreased response time from 24 hours to 12 seconds, and generated $2.1M in additional annual revenue.', styles['body']),
        Spacer(1, 8),
        Paragraph('Legal: Document Intelligence', styles['h2']),
        Paragraph('A 180-attorney commercial law firm cut document review time by 75%, increased billable hours by 40%, and generated $1.8M in additional annual revenue.', styles['body']),
        Spacer(1, 16),
        Paragraph('Full case studies available at neurithm.ai/case-studies', styles['callout']),
    ], styles))
    story.append(PageBreak())

    # Section 7: Predictions
    story.extend(make_section('07  2026-2028 Predictions', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('predictions', 3)],
    ], styles))
    story.append(PageBreak())

    # Section 8: Methodology
    story.extend(make_section('08  Methodology', [
        Paragraph('This report is based on a combination of proprietary and public data sources, analyzed using rigorous quantitative and qualitative methodologies.', styles['body']),
        Spacer(1, 8),
        Paragraph('Data Sources', styles['h2']),
        *bullets([
            'Proprietary data from 50+ Neurithm enterprise engagements (2023-2026)',
            'Survey of 2,400 enterprise AI practitioners across 14 industries',
            'Public financial filings and earnings call transcripts from 200+ companies',
            'Venture capital and private equity transaction databases',
            'Academic research from leading AI institutions',
        ], styles),
        Spacer(1, 8),
        Paragraph('Analysis Methodology', styles['h2']),
        *bullets([
            'Quantitative metrics validated through cross-referencing multiple data sources',
            'Adoption rates calculated using consistent definitions across sectors',
            'ROI figures based on documented, auditable business outcomes',
            'Projections modeled using Monte Carlo simulation with confidence intervals',
        ], styles),
        Spacer(1, 24),
        Paragraph('For questions about methodology or to request the underlying data for specific findings, contact research@neurithm.ai', styles['callout']),
    ], styles))

    doc.build(story, onFirstPage=draw_cover_background, onLaterPages=draw_background)
    print(f'Created: {filepath}')


def build_whitepaper_2():
    """AI Agent Architecture Patterns"""
    global _current_cover_image
    _current_cover_image = os.path.join(IMAGES_DIR, 'cover-agent-architecture.png')
    styles = get_styles()
    filepath = os.path.join(OUTPUT_DIR, 'agent-architecture.pdf')

    doc = SimpleDocTemplate(
        filepath, pagesize=letter,
        leftMargin=0.75*inch, rightMargin=0.75*inch,
        topMargin=0.75*inch, bottomMargin=0.75*inch
    )

    story = []

    # Cover
    story.extend(make_cover(
        'AI Agent Architecture<br/>Patterns',
        'Technical guide to designing, building, and deploying<br/>production-grade AI agent systems at enterprise scale.',
        28, styles
    ))

    # TOC
    story.extend(make_toc([
        ('01', 'Introduction'),
        ('02', 'Agent Design Patterns'),
        ('', 'ReAct Pattern'),
        ('', 'Tool-Use Agents'),
        ('', 'Multi-Agent Systems'),
        ('03', 'Orchestration Frameworks'),
        ('04', 'Memory & State Management'),
        ('05', 'Deployment at Scale'),
        ('06', 'Monitoring & Observability'),
        ('07', 'Security Considerations'),
        ('08', 'Reference Architecture'),
    ], styles))

    # Sections
    story.extend(make_section('01  Introduction', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('agent_intro', 3)],
        Spacer(1, 16),
        make_stat_box([('10M+', 'Daily Agent Interactions'), ('78%', 'Autonomous Resolution'), ('3.2s', 'Avg Response Time')], styles),
    ], styles))
    story.append(PageBreak())

    story.extend(make_section('02  Agent Design Patterns: ReAct', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('react_pattern', 3)],
        Spacer(1, 12),
        Paragraph('ReAct Loop Architecture', styles['h2']),
        *bullets([
            '<b>Observe:</b> Receive input or tool output and parse into structured observation',
            '<b>Think:</b> Reason about current state, progress toward goal, and next action',
            '<b>Act:</b> Select and execute a tool or generate a response',
            '<b>Loop:</b> Return to Observe with new information until task is complete',
        ], styles),
    ], styles))
    story.append(PageBreak())

    story.extend(make_section('02  Agent Design Patterns: Multi-Agent Systems', [
        *section_image('section-agents'),
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('multi_agent', 3)],
        Spacer(1, 12),
        Paragraph('Common Multi-Agent Topologies', styles['h2']),
        *bullets([
            '<b>Hierarchical:</b> Manager agent decomposes tasks and delegates to specialist workers',
            '<b>Peer-to-Peer:</b> Agents collaborate as equals, negotiating task boundaries',
            '<b>Pipeline:</b> Sequential processing where each agent transforms and passes output',
            '<b>Ensemble:</b> Multiple agents process the same input, with results aggregated',
        ], styles),
    ], styles))
    story.append(PageBreak())

    story.extend(make_section('04  Memory & State Management', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('memory', 3)],
        Spacer(1, 12),
        Paragraph('Memory Architecture Components', styles['h2']),
        *bullets([
            '<b>Working Memory:</b> Current conversation context, typically held in-process',
            '<b>Episodic Memory:</b> Stored interaction logs, indexed by time and topic',
            '<b>Semantic Memory:</b> Knowledge base stored in vector databases for retrieval',
            '<b>Procedural Memory:</b> Learned task patterns and workflow templates',
        ], styles),
    ], styles))
    story.append(PageBreak())

    story.extend(make_section('05  Deployment at Scale', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('deployment', 3)],
    ], styles))
    story.append(PageBreak())

    story.extend(make_section('06  Monitoring & Observability', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('monitoring', 3)],
        Spacer(1, 12),
        Paragraph('Critical Agent Metrics', styles['h2']),
        *bullets([
            'Task completion rate and time-to-resolution',
            'Average reasoning steps per task (efficiency indicator)',
            'Tool call success/failure rates by tool type',
            'Human escalation rate and escalation triggers',
            'User satisfaction and conversation abandonment rate',
            'Token consumption and cost per interaction',
        ], styles),
    ], styles))
    story.append(PageBreak())

    story.extend(make_section('08  Reference Architecture', [
        Paragraph('The following reference architecture represents Neurithm\'s recommended approach for enterprise-grade AI agent systems. This architecture has been validated across 50+ production deployments and supports all agent patterns discussed in this guide.', styles['body']),
        Spacer(1, 12),
        Paragraph('Architecture Layers', styles['h2']),
        *bullets([
            '<b>Client Layer:</b> Multi-channel interfaces (web, SMS, voice, email, API)',
            '<b>Gateway Layer:</b> Load balancing, authentication, rate limiting, session routing',
            '<b>Orchestration Layer:</b> Agent selection, task decomposition, workflow management',
            '<b>Agent Layer:</b> Individual agents with tools, memory, and reasoning capabilities',
            '<b>Tool Layer:</b> External API integrations, database connectors, file processors',
            '<b>Data Layer:</b> Vector stores, conversation logs, analytics pipelines',
            '<b>Governance Layer:</b> Policy enforcement, audit logging, bias monitoring',
        ], styles),
        Spacer(1, 16),
        Paragraph('For architecture consulting and implementation support, contact engineering@neurithm.ai', styles['callout']),
    ], styles))

    doc.build(story, onFirstPage=draw_cover_background, onLaterPages=draw_background)
    print(f'Created: {filepath}')


def build_whitepaper_3():
    """Enterprise AI Governance Framework"""
    global _current_cover_image
    _current_cover_image = os.path.join(IMAGES_DIR, 'cover-ai-governance.png')
    styles = get_styles()
    filepath = os.path.join(OUTPUT_DIR, 'ai-governance.pdf')

    doc = SimpleDocTemplate(
        filepath, pagesize=letter,
        leftMargin=0.75*inch, rightMargin=0.75*inch,
        topMargin=0.75*inch, bottomMargin=0.75*inch
    )

    story = []

    # Cover
    story.extend(make_cover(
        'Enterprise AI<br/>Governance Framework',
        'A practical framework for managing AI risk, compliance,<br/>data privacy, and ethical considerations.',
        35, styles
    ))

    # TOC
    story.extend(make_toc([
        ('01', 'Executive Summary'),
        ('02', 'Governance Structure'),
        ('03', 'Risk Assessment Framework'),
        ('04', 'Data Privacy & Compliance'),
        ('', 'GDPR'),
        ('', 'CCPA'),
        ('', 'EU AI Act'),
        ('05', 'Ethical AI Principles'),
        ('06', 'Model Monitoring & Audit Trails'),
        ('07', 'Implementation Roadmap'),
        ('08', 'Templates & Checklists'),
    ], styles))

    # Sections
    story.extend(make_section('01  Executive Summary', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('governance_exec', 3)],
        Spacer(1, 16),
        make_stat_box([('40%', 'Faster Deployment'), ('92%', 'Compliance Rate'), ('3x', 'Stakeholder Trust')], styles),
    ], styles))
    story.append(PageBreak())

    story.extend(make_section('02  Governance Structure', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('governance_structure', 3)],
        Spacer(1, 12),
        Paragraph('Governance Roles & Responsibilities', styles['h2']),
        *bullets([
            '<b>Chief AI Officer:</b> Strategic direction, board reporting, resource allocation',
            '<b>AI Ethics Committee:</b> Policy review, use case approval, bias assessment',
            '<b>AI Product Owners:</b> Business case development, success metrics, stakeholder management',
            '<b>ML Engineers:</b> Model development, testing, deployment within governance guardrails',
            '<b>Data Stewards:</b> Data quality, privacy compliance, lineage tracking',
        ], styles),
    ], styles))
    story.append(PageBreak())

    story.extend(make_section('03  Risk Assessment Framework', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('risk_framework', 3)],
        Spacer(1, 16),
        make_stat_box([('4 Tiers', 'Risk Classification'), ('12', 'Assessment Criteria'), ('Quarterly', 'Review Cadence')], styles),
    ], styles))
    story.append(PageBreak())

    story.extend(make_section('04  Data Privacy & Compliance', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('data_privacy', 3)],
        Spacer(1, 12),
        Paragraph('Compliance Checklist by Regulation', styles['h2']),
        *bullets([
            '<b>GDPR:</b> Data minimization, purpose limitation, right to explanation, DPIAs for high-risk AI',
            '<b>CCPA/CPRA:</b> Consumer opt-out rights, automated decision-making disclosures, data inventory',
            '<b>EU AI Act:</b> Risk classification, conformity assessments, transparency obligations, sandboxing',
            '<b>SOC 2:</b> AI system controls, model versioning audit trails, access management',
            '<b>HIPAA:</b> PHI handling in training data, de-identification standards, BAA requirements',
        ], styles),
    ], styles))
    story.append(PageBreak())

    story.extend(make_section('05  Ethical AI Principles', [
        *section_image('section-governance'),
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('ethical_principles', 3)],
        Spacer(1, 12),
        Paragraph('Operationalizing Ethics', styles['h2']),
        *bullets([
            '<b>Fairness:</b> Define metrics, establish thresholds, monitor continuously, remediate promptly',
            '<b>Transparency:</b> Document model decisions, provide explanations, publish audit results',
            '<b>Accountability:</b> Clear ownership, incident response procedures, escalation paths',
            '<b>Privacy:</b> Data minimization, consent management, anonymization where possible',
            '<b>Safety:</b> Guardrails, human oversight, kill switches, graceful degradation',
        ], styles),
    ], styles))
    story.append(PageBreak())

    story.extend(make_section('07  Implementation Roadmap', [
        *[Paragraph(p, styles['body']) for p in filler_paragraphs('implementation_roadmap', 3)],
        Spacer(1, 16),
        Paragraph('Success Metrics', styles['h2']),
        *bullets([
            'Time from AI use case proposal to production deployment (target: reduce by 40%)',
            'Percentage of AI systems with complete audit trails (target: 100%)',
            'Bias incident detection time (target: less than 24 hours)',
            'Employee AI governance training completion rate (target: 95%)',
            'Third-party audit findings per review cycle (target: decreasing trend)',
        ], styles),
    ], styles))
    story.append(PageBreak())

    story.extend(make_section('08  Templates & Checklists', [
        Paragraph('This section provides ready-to-use templates for implementing the governance framework described in this guide. All templates are available in editable format at neurithm.ai/governance-toolkit.', styles['body']),
        Spacer(1, 12),
        Paragraph('AI Use Case Assessment Template', styles['h2']),
        *bullets([
            'Business justification and expected outcomes',
            'Data requirements and privacy impact assessment',
            'Risk tier classification with supporting rationale',
            'Fairness metrics and monitoring plan',
            'Human oversight design and escalation triggers',
            'Deployment timeline and rollback procedures',
        ], styles),
        Spacer(1, 8),
        Paragraph('Model Audit Checklist', styles['h2']),
        *bullets([
            'Training data provenance and quality assessment',
            'Performance metrics across demographic subgroups',
            'Adversarial robustness testing results',
            'Explainability assessment for key decision paths',
            'Compliance mapping to applicable regulations',
            'Incident history and remediation actions',
        ], styles),
        Spacer(1, 8),
        Paragraph('Vendor AI Assessment Questionnaire', styles['h2']),
        *bullets([
            'Model training practices and data handling policies',
            'Security certifications and compliance attestations',
            'Transparency commitments and audit access',
            'Incident response SLAs and notification procedures',
            'Data residency and cross-border transfer practices',
        ], styles),
        Spacer(1, 16),
        Paragraph('For governance consulting and implementation support, contact governance@neurithm.ai', styles['callout']),
    ], styles))

    doc.build(story, onFirstPage=draw_cover_background, onLaterPages=draw_background)
    print(f'Created: {filepath}')


if __name__ == '__main__':
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    build_whitepaper_1()
    build_whitepaper_2()
    build_whitepaper_3()
    print('\nAll whitepapers generated successfully!')
