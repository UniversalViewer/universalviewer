/// <reference path="../../js/jquery.d.ts" />
import baseExtension = require("./baseExtension");
import baseView = require("./baseView");
import utils = require("../../utils");
import help = require("../uv-dialogues-module/helpDialogue");
import settings = require("../uv-dialogues-module/settingsDialogue");
import BootstrapParams = require("../../bootstrapParams");

export class HeaderPanel extends baseView.BaseView {

    $options: JQuery;
    $centerOptions: JQuery;
    $rightOptions: JQuery;
    $pagingToggleButton: JQuery;
    $localeToggleButton: JQuery;
    $helpButton: JQuery;
    $settingsButton: JQuery;
    $messageBox: JQuery;

    message: string;

    static UPDATE_SETTINGS: string = 'header.onUpdateSettings';

    constructor($element: JQuery) {
        super($element, false, false);
    }

    create(): void {

        this.setConfig('headerPanel');

        super.create();

        $.subscribe(baseExtension.BaseExtension.SETTINGS_CHANGED, (e, message) => {
            this.updatePagingToggle();
        });

        $.subscribe(baseExtension.BaseExtension.SHOW_MESSAGE, (e, message) => {
            this.showMessage(message);
        });

        $.subscribe(baseExtension.BaseExtension.HIDE_MESSAGE, () => {
            this.hideMessage();
        });

        this.$options = $('<div class="options"></div>');
        this.$element.append(this.$options);

        this.$centerOptions = $('<div class="centerOptions"></div>');
        this.$options.append(this.$centerOptions);

        this.$rightOptions = $('<div class="rightOptions"></div>');
        this.$options.append(this.$rightOptions);

        //this.$helpButton = $('<a href="#" class="action help">' + this.content.help + '</a>');
        //this.$rightOptions.append(this.$helpButton);

        this.$pagingToggleButton = $('<a class="imageBtn pagingToggle"></a>');
        this.$rightOptions.append(this.$pagingToggleButton);

        this.$localeToggleButton = $('<a class="localeToggle"></a>');
        this.$rightOptions.append(this.$localeToggleButton);

        this.$settingsButton = $('<a class="imageBtn settings" tabindex="3"></a>');
        this.$settingsButton.attr('title', this.content.settings);
        this.$rightOptions.append(this.$settingsButton);

        this.$messageBox = $('<div class="messageBox"> \
                                <div class="text"></div> \
                                <div class="close"></div> \
                              </div>');

        this.$element.append(this.$messageBox);

        this.$messageBox.hide();
        this.$messageBox.find('.close').attr('title', this.content.close);
        this.$messageBox.find('.close').on('click', (e) => {
            e.preventDefault();
            this.hideMessage();            
        });

        this.updatePagingToggle();

        this.updateLocaleToggle();

        this.$pagingToggleButton.on('click', () => {
            var settings: ISettings = this.getSettings();
            settings.pagingEnabled = !settings.pagingEnabled;
            this.updateSettings(settings);
        });

        this.$localeToggleButton.on('click', () => {
            this.provider.changeLocale(this.$localeToggleButton.data('locale'));
        });

        this.$settingsButton.onPressed(() => {
            $.publish(settings.SettingsDialogue.SHOW_SETTINGS_DIALOGUE);
        });

        if (this.options.localeToggleEnabled === false){
            this.$localeToggleButton.hide();
        }

        if (this.options.pagingToggleEnabled === false){
            this.$pagingToggleButton.hide();
        }
    }

    updatePagingToggle(): void {
        if (!this.provider.isPagingEnabled()){
            this.$pagingToggleButton.hide();
            return;
        }

        var settings: ISettings = this.provider.getSettings();

        if (settings.pagingEnabled){
            this.$pagingToggleButton.removeClass('two-up');
            this.$pagingToggleButton.addClass('one-up');
            this.$pagingToggleButton.prop('title', this.content.oneUp);
        } else {
            this.$pagingToggleButton.removeClass('one-up');
            this.$pagingToggleButton.addClass('two-up');
            this.$pagingToggleButton.prop('title', this.content.twoUp);
        }
    }

    updateLocaleToggle(): void {
        if (!this.localeToggleIsVisible()){
            this.$localeToggleButton.hide();
            return;
        }

        var alternateLocale = this.provider.getAlternateLocale();
        var text = alternateLocale.name.split('-')[0].toUpperCase();

        this.$localeToggleButton.data('locale', alternateLocale.name);
        this.$localeToggleButton.attr('title', alternateLocale.label);
        this.$localeToggleButton.text(text);
    }

    localeToggleIsVisible(): boolean {
        return this.provider.getLocales().length > 1 && this.options.localeToggleEnabled;
    }

    pagingToggleIsVisible(): boolean {
        return this.options.pagingToggleEnabled;
    }

    showMessage(message: string): void {
        this.message = message;
        this.$messageBox.find('.text').html(message).find('a').attr('target', '_top');
        this.$messageBox.show();
        this.$element.addClass('showMessage');
        this.extension.resize();
    }

    hideMessage(): void {
        this.$element.removeClass('showMessage');
        this.$messageBox.hide();
        this.extension.resize();
    }

    getSettings(): ISettings {
        return this.provider.getSettings();
    }

    updateSettings(settings: ISettings): void {
        this.provider.updateSettings(settings);

        $.publish(HeaderPanel.UPDATE_SETTINGS, [settings]);
    }

    resize(): void {
        super.resize();

        var headerWidth = this.$element.width();
        var center = headerWidth / 2;
        var containerWidth = this.$centerOptions.outerWidth();
        var pos = center - (containerWidth / 2);

        this.$centerOptions.css({
            left: pos
        });

        if (this.$messageBox.is(':visible')){
            var $text = this.$messageBox.find('.text');
            //$text.actualWidth(this.$element.width() - this.$messageBox.find('.close').outerWidth(true));
            $text.width(this.$element.width() - this.$messageBox.find('.close').outerWidth(true));
            $text.ellipsisFill(this.message);
        }

        // hide toggle buttons below minimum width
        if (this.extension.width() < 610){
            if (this.pagingToggleIsVisible()) this.$pagingToggleButton.hide();
            if (this.localeToggleIsVisible()) this.$localeToggleButton.hide();
        } else {
            if (this.pagingToggleIsVisible()) this.$pagingToggleButton.show();
            if (this.localeToggleIsVisible()) this.$localeToggleButton.show();
        }
    }
}