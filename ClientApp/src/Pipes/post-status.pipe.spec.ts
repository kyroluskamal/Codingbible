import { PostStatusPipe } from './post-status.pipe';

describe('PostStatusPipe', () =>
{
  it('transform 0 to Draft', () =>
  {
    const pipe = new PostStatusPipe();
    expect(pipe.transform(0)).toBe("Draft");
  });
  it('transform 1 to Pulished', () =>
  {
    const pipe = new PostStatusPipe();
    expect(pipe.transform(1)).toBe("Published");
  });
  it('transform anynumber to null', () =>
  {
    const pipe = new PostStatusPipe();
    expect(pipe.transform(3)).toBeNull();
  });
});
