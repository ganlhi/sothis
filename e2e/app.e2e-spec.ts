import { SothisUiPage } from './app.po';

describe('sothis-ui App', function() {
  let page: SothisUiPage;

  beforeEach(() => {
    page = new SothisUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
