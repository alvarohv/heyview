import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { blogSlug } from '../content.config';
import en from '../i18n/en';

export async function GET(context: APIContext) {
  const posts = (
    await getCollection('blog', ({ data }) => !data.draft && data.lang === 'en')
  ).sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: 'HeyView Blog',
    description: en.blogPage.description,
    site: context.site ?? 'https://heyview.studio',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${blogSlug(post.id)}/`,
      categories: post.data.tags,
    })),
    customData: '<language>en-us</language>',
  });
}
