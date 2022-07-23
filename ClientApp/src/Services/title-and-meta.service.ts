import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleAndMetaService
{

  constructor(private title: Title, @Inject(DOCUMENT) private document: Document,
    private meta: Meta) { }
  allMetaTags: MetaDefinition[] = [];
  setSEO_Requirements(title: string, description: string, image: string, url: string, isArabic: boolean)
  {
    this.document.getElementsByTagName('html')[0].setAttribute('lang', isArabic ? 'ar' : 'en');
    this.allMetaTags.push({ name: 'description', content: description },
      { name: 'author', content: 'Kyrolus Kamal' },
      ...this.FaceBookMetaTags(title, description, image, isArabic ? 'ar/' + url : url),
      ...this.TwitterMetaTags(title, description, image, isArabic ? 'ar/' + url : url, isArabic));
    this.title.setTitle(title + ' | Coding Bible');
    for (let meta of this.allMetaTags)
    {
      let metaByName = this.meta.getTag(`name='${meta.name}'`!);
      let metaByProperty = this.meta.getTag(`property='${meta.property}'`);
      if (metaByName || metaByProperty)
      {
        this.meta.updateTag(meta);
      } else
      {
        this.meta.addTag(meta);
      }
    }
  }
  notFoundTitle(isArabic: boolean)
  {
    this.title.setTitle(isArabic ? '404 Not Found | Coding Bible' : '404 خطا غير موجود | Coding Bible');
  }
  private FaceBookMetaTags(title: string, description: string, image: string, url: string,)
  {
    let faceBookMetaTags: MetaDefinition[] = [
      { property: 'og:title', content: title },
      { property: 'og:type', content: "blog" },
      { property: 'og:description', content: description },
      { property: 'og:image', content: window.location.origin + image },
      { property: 'og:url', content: window.location.origin + '/' + url },
      { property: 'og:site_name', content: 'Coding Bible' },
    ];
    return faceBookMetaTags;
  }
  private TwitterMetaTags(title: string, description: string, image: string, url: string, isArabic: boolean)
  {
    let twitterMetaTags: MetaDefinition[] = [
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: isArabic ? '@CodingbibleAr' : '@CodingBibleEN' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: window.location.origin + image },
      { name: 'twitter:url', content: window.location.origin + '/' + url },
    ];
    return twitterMetaTags;
  }
}
