import { DefaultUrlSerializer, UrlSegmentGroup, UrlTree } from '@angular/router';

export class LowerCaseUrlSerializer extends DefaultUrlSerializer
{
    override parse(url: string): UrlTree
    {
        const urlTree = super.parse(url);

        this.lowerCaseSegments(urlTree.root);

        return urlTree;
    }
    private lowerCaseSegments(urlSegmentGroup: UrlSegmentGroup)
    {
        if (urlSegmentGroup.hasChildren())
        {
            Object.entries(urlSegmentGroup.children).forEach(
                ([key, value]) => this.lowerCaseSegments(value)
            );
        }

        urlSegmentGroup.segments.forEach((segment) => segment.path = segment.path.toLowerCase());
    }
}