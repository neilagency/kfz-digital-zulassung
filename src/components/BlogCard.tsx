import Link from 'next/link';
import Image from 'next/image';
import { LocalPost, stripHtml, formatDate } from '@/lib/db';
import { normalizeImageUrl } from '@/lib/media';

interface BlogCardProps {
  post: LocalPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const title = stripHtml(post.title);
  const publishDate = post.publishedAt || post.createdAt;
  const postUrl = '/insiderwissen/' + post.slug;
  const imageSrc = normalizeImageUrl(post.featuredImage);

  const excerptRaw = stripHtml(post.excerpt || '').trim();
  const excerpt = excerptRaw ? excerptRaw.slice(0, 160) + '\u2026' : '';

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {!!imageSrc && (
        <Link href={postUrl} className="block relative aspect-[16/10] overflow-hidden bg-gray-100">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            unoptimized={imageSrc.startsWith('/uploads/')}
          />
        </Link>
      )}

      <div className="p-5">
        <time
  dateTime={new Date(publishDate).toISOString()}
  className="text-xs text-gray-600 font-medium"
>
  {formatDate(publishDate)}
</time>

        <h3 className="mt-2 text-lg font-bold text-primary group-hover:text-accent transition-colors line-clamp-2">
          <Link href={postUrl}>
            {title}
          </Link>
        </h3>

        {excerpt && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{excerpt}</p>
        )}
      </div>
    </article>
  );
}
