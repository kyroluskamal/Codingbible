import { isPlatformServer } from '@angular/common';
import { Directive, Inject, PLATFORM_ID, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[Shell_NoRender]',
  standalone: true
})
export class AppShellNoRenderDirective
{

  constructor(private templateRed: TemplateRef<any>,
    @Inject(PLATFORM_ID) private platformId: object,
    private viewContainer: ViewContainerRef) { }

  ngOnInit()
  {
    if (isPlatformServer(this.platformId))
    {
      this.viewContainer.clear();
    } else
    {
      this.viewContainer.createEmbeddedView(this.templateRed);
    }
  }
}
