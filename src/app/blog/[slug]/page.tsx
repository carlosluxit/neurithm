import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Clock, Calendar, User, ArrowRight, BookOpen } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog-data'

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

// ---------------------------------------------------------------------------
// SEO metadata
// ---------------------------------------------------------------------------

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return {}

  return {
    title: `${post.title} — Neurithm`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
    },
    other: {
      'article:published_time': post.date,
      'article:author': post.author.name,
      'article:section': post.category,
    },
  }
}

// ---------------------------------------------------------------------------
// Simple Markdown-ish parser
// ---------------------------------------------------------------------------

function parseMarkdown(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // blank line — skip
    if (line.trim() === '') {
      i++
      continue
    }

    // ### subheading
    if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={key++}
          id={slugify(line.slice(4))}
          className="text-xl font-semibold mt-10 mb-4 text-foreground"
        >
          {renderInline(line.slice(4))}
        </h3>,
      )
      i++
      continue
    }

    // ## heading
    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={key++}
          id={slugify(line.slice(3))}
          className="text-2xl font-bold mt-12 mb-5 text-foreground"
        >
          {renderInline(line.slice(3))}
        </h2>,
      )
      i++
      continue
    }

    // unordered list
    if (line.trimStart().startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].trimStart().startsWith('- ')) {
        items.push(lines[i].trimStart().slice(2))
        i++
      }
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-2 my-4 text-muted pl-2">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>,
      )
      continue
    }

    // ordered list
    if (/^\d+\.\s/.test(line.trimStart())) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trimStart())) {
        items.push(lines[i].trimStart().replace(/^\d+\.\s/, ''))
        i++
      }
      elements.push(
        <ol key={key++} className="list-decimal list-inside space-y-2 my-4 text-muted pl-2">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ol>,
      )
      continue
    }

    // paragraph (collect consecutive non-special lines)
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('## ') &&
      !lines[i].startsWith('### ') &&
      !lines[i].trimStart().startsWith('- ') &&
      !/^\d+\.\s/.test(lines[i].trimStart())
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      elements.push(
        <p key={key++} className="text-muted leading-relaxed my-4">
          {renderInline(paraLines.join(' '))}
        </p>,
      )
    }
  }

  return elements
}

/** Render bold, inline code, and plain text within a line. */
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  // Match **bold** or `code`
  const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    if (match[2]) {
      // bold
      parts.push(
        <strong key={match.index} className="text-foreground font-semibold">
          {match[2]}
        </strong>,
      )
    } else if (match[3]) {
      // inline code
      parts.push(
        <code
          key={match.index}
          className="text-accent-light bg-accent/10 px-1.5 py-0.5 rounded text-sm font-mono"
        >
          {match[3]}
        </code>,
      )
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts
}

/** Create a URL-safe slug from a heading string. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Extract ## and ### headings for the table of contents. */
function extractHeadings(content: string) {
  const headings: { level: number; text: string; id: string }[] = []
  for (const line of content.split('\n')) {
    if (line.startsWith('### ')) {
      const text = line.slice(4).replace(/\*\*/g, '').replace(/`/g, '')
      headings.push({ level: 3, text, id: slugify(text) })
    } else if (line.startsWith('## ')) {
      const text = line.slice(3).replace(/\*\*/g, '').replace(/`/g, '')
      headings.push({ level: 2, text, id: slugify(text) })
    }
  }
  return headings
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const headings = extractHeadings(post.content)
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent-light transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to blog
        </Link>

        {/* Post header */}
        <header className="max-w-3xl mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-xs font-medium text-accent-light px-3 py-1 rounded-full border border-accent/20 bg-accent/5">
              {post.category}
            </span>
            <span className="text-xs text-muted flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="text-xs text-muted flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-muted leading-relaxed">{post.excerpt}</p>
        </header>

        {/* Body: sidebar + article */}
        <div className="flex gap-12 lg:gap-16 relative">
          {/* Table of contents — sticky sidebar (desktop) */}
          {headings.length > 0 && (
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <nav className="sticky top-32">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  On this page
                </p>
                <ul className="space-y-2 border-l border-border pl-4">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className={`block text-xs leading-snug transition-colors hover:text-accent-light ${
                          h.level === 3 ? 'pl-3 text-muted-foreground' : 'text-muted'
                        }`}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}

          {/* Article content */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {parseMarkdown(post.content)}

            {/* Author box */}
            <div className="glass-card rounded-2xl p-6 mt-16 flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-accent-light" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{post.author.name}</p>
                <p className="text-sm text-muted">{post.author.role}</p>
              </div>
            </div>
          </article>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="glass-card rounded-2xl p-6 group transition-all duration-300 hover:border-accent/20"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-accent-light">{rp.category}</span>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {rp.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-accent-light transition-colors">
                    {rp.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed line-clamp-2">{rp.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-accent-light mt-3">
                    Read more
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-24 glass-card rounded-2xl p-10 md:p-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to transform your business?
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-8 leading-relaxed">
            Take our free AI Assessment to discover where AI can drive the most impact in your
            organization — in less than 5 minutes.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent hover:bg-accent-dark text-white font-medium transition-colors"
          >
            Take the Free AI Assessment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  )
}
