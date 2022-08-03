import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'UrlForScreen',
  standalone: true
})
export class ImageUrlForScreen implements PipeTransform
{
  constructor() { }
  transform(value: string)
  {
    var regx = new RegExp("_xl");
    if (value.match(/_xl|_md|_sm/))
    {
      return value.replace(/_xl|_md|_sm/, this.checkScreenSize());
    }
    return value;
  }


  checkScreenSize()
  {
    let innerWidth = window.innerWidth;
    switch (true)
    {
      case innerWidth > 1280: return '_xl';
      case innerWidth > 768: return '_md';
      case innerWidth > 320: return '_sm';
      default: return '_xl';
    }
  }

  //   320px — 480px: Mobile devices
  // 481px — 768px: iPads, Tablets
  // 769px — 1024px: Small screens, laptops
  // 1025px — 1200px: Desktops, large screens
  // 1201px and more —  Extra large screens, TV
}
