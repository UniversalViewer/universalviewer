import BaseCommands = require("./BaseCommands");
import BaseView = require("./BaseView");
import BootstrapParams = require("../../BootstrapParams");
import Information = require("../uv-shared-module/Information");
import InformationAction = require("../uv-shared-module/InformationAction");
import InformationArgs = require("../uv-shared-module/InformationArgs");
import InformationFactory = require("../uv-shared-module/InformationFactory");
import SettingsDialogue = require("../uv-dialogues-module/SettingsDialogue");

class HeaderPanel extends BaseView {

    $centerOptions: JQuery;
    $helpButton: JQuery;
    $informationBox: JQuery;
    $localeToggleButton: JQuery;
    $options: JQuery;
    $rightOptions: JQuery;
    $settingsButton: JQuery;
    information: Information;

    constructor($element: JQuery) {
        super($element, false, false);
    }

    create(): void {

        this.setConfig('headerPanel');

        super.create();

        $.subscribe(BaseCommands.SHOW_INFORMATION, (e, args: InformationArgs) => {
            this.showInformation(args);
        });

        $.subscribe(BaseCommands.HIDE_INFORMATION, () => {
            this.hideInformation();
        });

        this.$options = $('<div class="options"></div>');
        this.$element.append(this.$options);

        this.$centerOptions = $('<div class="centerOptions"></div>');
        this.$options.append(this.$centerOptions);

        this.$rightOptions = $('<div class="rightOptions"></div>');
        this.$options.append(this.$rightOptions);

        //this.$helpButton = $('<a href="#" class="action help">' + this.content.help + '</a>');
        //this.$rightOptions.append(this.$helpButton);

        this.$localeToggleButton = $('<a class="localeToggle" tabindex="0"></a>');
        this.$rightOptions.append(this.$localeToggleButton);

        this.$settingsButton = $('<a class="imageBtn settings" tabindex="0"></a>');
        this.$settingsButton.attr('title', this.content.settings);
        this.$rightOptions.append(this.$settingsButton);

        this.$informationBox = $('<div class="informationBox"> \
                                    <div class="message"></div> \
                                    <div class="actions"></div> \
                                    <div class="close"></div> \
                                  </div>');

        this.$element.append(this.$informationBox);

        this.$informationBox.hide();
        this.$informationBox.find('.close').attr('title', this.content.close);
        this.$informationBox.find('.close').on('click', (e) => {
            e.preventDefault();
            $.publish(BaseCommands.HIDE_INFORMATION);
        });

        this.$localeToggleButton.on('click', () => {
            this.extension.changeLocale(String(this.$localeToggleButton.data('locale')));
        });

        this.$settingsButton.onPressed(() => {
            $.publish(BaseCommands.SHOW_SETTINGS_DIALOGUE);
        });

        this.updateLocaleToggle();
        this.updateSettingsButton();
    }

    updateLocaleToggle(): void {
        if (!this.localeToggleIsVisible()){
            this.$localeToggleButton.hide();
            return;
        }

        var alternateLocale = this.extension.getAlternateLocale();
        var text = alternateLocale.name.split('-')[0].toUpperCase();

        this.$localeToggleButton.data('locale', alternateLocale.name);
        this.$localeToggleButton.attr('title', alternateLocale.label);
        this.$localeToggleButton.text(text);
    }

    updateSettingsButton(): void {
        var settingsEnabled: boolean = Utils.Bools.getBool(this.options.settingsButtonEnabled, true);
        if (!settingsEnabled){
            this.$settingsButton.hide();
        } else {
            this.$settingsButton.show();
        }
    }

    localeToggleIsVisible(): boolean {
        return this.extension.getLocales().length > 1 && Utils.Bools.getBool(this.options.localeToggleEnabled, false);
    }

    showInformation(args: InformationArgs): void {

        var informationFactory: InformationFactory = new InformationFactory(this.extension);

        this.information = informationFactory.Get(args);
        var $message = this.$informationBox.find('.message');
        $message.html(this.information.message).find('a').attr('target', '_top');
        var $actions = this.$informationBox.find('.actions');
        $actions.empty();

        for (var i = 0; i < this.information.actions.length; i++) {
            var action: InformationAction = this.information.actions[i];

            var $action = $('<a href="#" class="btn btn-default">' + action.label + '</a>');
            $action.on('click', action.action);

            $actions.append($action);
        }

        this.$informationBox.show();
        this.$element.addClass('showInformation');
        this.extension.resize();
    }

    hideInformation(): void {
        this.$element.removeClass('showInformation');
        this.$informationBox.hide();
        this.extension.resize();
    }

    getSettings(): ISettings {
        return this.extension.getSettings();
    }

    updateSettings(settings: ISettings): void {
        this.extension.updateSettings(settings);

        $.publish(BaseCommands.UPDATE_SETTINGS, [settings]);
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

        if (this.$informationBox.is(':visible')){
            var $actions = this.$informationBox.find('.actions');
            var $message = this.$informationBox.find('.message');
            $message.width(this.$element.width() - $message.horizontalMargins() - $actions.outerWidth(true) - this.$informationBox.find('.close').outerWidth(true) - 1);
            $message.ellipsisFill(this.information.message);
        }

        // hide toggle buttons below minimum width
        if (this.extension.width() < this.extension.config.options.minWidthBreakPoint){
            if (this.localeToggleIsVisible()) this.$localeToggleButton.hide();
        } else {
            if (this.localeToggleIsVisible()) this.$localeToggleButton.show();
        }
    }
}

export = HeaderPanel;