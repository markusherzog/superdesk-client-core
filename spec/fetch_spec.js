

var workspace = require('./helpers/pages').workspace,
    content = require('./helpers/pages').content,
    authoring = require('./helpers/authoring'),
    desks = require('./helpers/desks');

describe('fetch', () => {
    beforeEach(() => {
        workspace.open();
        workspace.switchToDesk('SPORTS DESK');
        content.setListView();
    });

    xit('items in personal should have copy icon and in desk should have duplicate icon',
        () => {
            var menu = content.openItemMenu('item4');

            expect(menu.element(by.partialLinkText('Duplicate')).isDisplayed()).toBe(true);
            expect(menu.element(by.partialLinkText('Copy')).isPresent()).toBe(false);

            workspace.switchToDesk('PERSONAL');
            content.setListView();

            menu = content.openItemMenu('item1');
            expect(menu.element(by.partialLinkText('Copy')).isDisplayed()).toBe(true);
            expect(menu.element(by.partialLinkText('Duplicate')).isPresent()).toBe(false);
        }
    );

    // @todo(petr): figure out how it should work for authoring+list
    xit('can fetch from ingest with keyboards', () => {
        var body;

        workspace.openIngest();
        // select & fetch item
        body = $('body');
        body.sendKeys(protractor.Key.DOWN);
        body.sendKeys('f');
        workspace.open();
        workspace.switchToDesk('SPORTS DESK');
        expect(content.count()).toBe(3);
    });

    it('can fetch from ingest with menu', () => {
        workspace.openIngest();
        content.actionOnItem('Fetch', 0);
        workspace.openContent();
        expect(content.count()).toBe(3);
    });

    it('can fetch from content with menu', () => {
        workspace.openIngest();
        content.actionOnItem('Fetch', 0);
        workspace.openContent();
        expect(content.count()).toBe(3);
    });

    it('can fetch as', () => {
        workspace.openIngest();
        content.actionOnItem('Fetch To', 0);
        content.send();
        workspace.openContent();
        expect(content.count()).toBe(3);
    });

    it('can remove ingest item', () => {
        workspace.openIngest();
        content.actionOnItem('Remove', 0);
        expect(content.count()).toBe(0);
    });

    it('can not Fetch-and-Open if selected desk as a non-member', () => {
        workspace.openIngest();
        content.actionOnItem('Fetch To', 0);

        var btnFetchAndOpen = element(by.css('[ng-disabled="disableFetchAndOpenButton()"]'));

        expect(btnFetchAndOpen.getAttribute('disabled')).toBeFalsy();

        // Adding a new desk with no member, which serves as a non-member desk when selected
        desks.openDesksSettings();
        desks.getNewDeskButton().click();
        desks.deskNameElement().sendKeys('Test Desk');
        desks.deskDescriptionElement().sendKeys('Test Description');
        desks.deskSourceElement().sendKeys('Test Source');
        desks.setDeskType('authoring');
        desks.actionDoneOnGeneralTab();

        workspace.openIngest();
        content.actionOnItem('Fetch To', 0);
        authoring.selectDeskforSendTo('Test Desk');
        expect(btnFetchAndOpen.getAttribute('disabled')).toBeTruthy();
    });

    it('can fetch multiple items', () => {
        workspace.openIngest();
        content.selectItem(0);
        browser.sleep(1000); // Wait for animation
        element(by.id('fetch-all-btn')).click();
        workspace.openContent();
        expect(content.count()).toBe(3);
    });

    it('can fetch as multiple items', () => {
        workspace.openIngest();
        content.selectItem(0);
        browser.sleep(1000); // Wait for animation
        element(by.id('fetch-all-as-btn')).click();
        content.send();
        workspace.openContent();
        expect(content.count()).toBe(3);
    });

    it('can remove multiple ingest item', () => {
        workspace.openIngest();
        content.selectItem(0);
        browser.sleep(1000); // Wait for animation
        element(by.id('remove-all-as-btn')).click();
        expect(content.count()).toBe(0);
    });
});
