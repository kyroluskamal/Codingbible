import { Directive, ElementRef, HostBinding, HostListener, Input, Renderer2 } from '@angular/core';
import * as Constants from '../Helpers/constants';
@Directive({
  selector: '[AnimateOnScroll]'
})
export class AnimateOnScrollDirective
{
  Constants = Constants;
  @Input() animationName = "";
  @HostBinding('class') class = "";

  constructor(public elementRef: ElementRef) { }

  @HostListener('window:scroll')
  onWindowScroll()
  {
    console.log("Scrolled");
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    if (
      rect.top >= 0 &&
      rect.top <= (window.innerHeight || this.elementRef.nativeElement.clientHeight)
    )
    {
      this.class = `${this.getClassName(this.animationName)}`;
    } else
    {
      this.class = "";
    }

  }


  getClassName(animationName: string)
  {
    switch (animationName)
    {
      case this.Constants.AnimationClasses.FadeUp: return "animated fadeInUp";
      case this.Constants.AnimationClasses.BounceUp: return "animate__animated animate__bounce";
      default: return "";
    }
  }
}
