
class AutoComplete{

	results: any;
	selectedResultIndex: number;
    $element: JQuery;
    autoCompleteFunc: (terms: string, cb: (results: string[]) => void) => void;
    delay: number;
    minChars: number;
    onSelect: (terms: string) => void;
    parseResultsFunc: (results: string[]) => string[];
    positionAbove: boolean;

	$searchResultsList: JQuery;
	$searchResultTemplate: JQuery;
	element: HTMLInputElement;

    validKeyDownCodes: number[] = [KeyCodes.KeyDown.Backspace, KeyCodes.KeyDown.Spacebar, KeyCodes.KeyDown.Tab, KeyCodes.KeyDown.LeftArrow, KeyCodes.KeyDown.RightArrow, KeyCodes.KeyDown.Delete];
    lastKeyDownWasValid: boolean = false;

    constructor(element: JQuery,
                autoCompleteFunc: (terms: string, cb: (results: string[]) => void) => void,
                parseResultsFunc: (results: any) => string[],
                onSelect: (terms: string) => void,
                delay: number = 300,
                minChars: number = 2,
                positionAbove: boolean = false){

        this.$element = element;
        this.autoCompleteFunc = autoCompleteFunc;
        this.delay = delay;
        this.minChars = minChars;
        this.onSelect = onSelect;
        this.parseResultsFunc = parseResultsFunc;
        this.positionAbove = positionAbove;

        // create ui.
        this.$searchResultsList = $('<ul class="autocomplete"></ul>');

        if (this.positionAbove){
            this.$element.parent().prepend(this.$searchResultsList);
        } else {
            this.$element.parent().append(this.$searchResultsList);
        }

        this.$searchResultTemplate = $('<li class="result"><a href="#"></a></li>');

        // init ui.

        // callback after set period.
        var typewatch = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();

        var that = this;

        // validate

        this.$element.on("keydown", function(e: JQueryEventObject) {

            var originalEvent: KeyboardEvent = <KeyboardEvent>e.originalEvent;

            that.lastKeyDownWasValid = that.isValidKeyDown(originalEvent);

            var charCode = Utils.Keyboard.GetCharCode(originalEvent);

            var cancelEvent: boolean = false;

            if (charCode === KeyCodes.KeyDown.LeftArrow){
                cancelEvent = true;
            } else if (charCode === KeyCodes.KeyDown.RightArrow){
                cancelEvent = true;
            }

            if (cancelEvent){
                originalEvent.cancelBubble = true;
                if(originalEvent.stopPropagation) originalEvent.stopPropagation();
            }
        });

        // prevent invalid characters being entered
        this.$element.on("keypress", function(e: JQueryEventObject) {

            var isValidKeyPress: boolean = that.isValidKeyPress(<KeyboardEvent>e.originalEvent);

            if (!(that.lastKeyDownWasValid || isValidKeyPress)){
                e.preventDefault();
                return false;
            }

            return true;
        });

        // auto complete
        this.$element.on("keyup", function(e) {

            // if pressing enter without a list item selected
            if (!that.getSelectedListItem().length && e.keyCode === KeyCodes.KeyDown.Enter) { // enter
                that.onSelect(that.getTerms());
                return;
            }

            // If there are search results
            if (that.$searchResultsList.is(':visible') && that.results.length) {
                if (e.keyCode === KeyCodes.KeyDown.Enter) {
                    that.searchForItem(that.getSelectedListItem());
                } else if (e.keyCode === KeyCodes.KeyDown.DownArrow) {
                    that.setSelectedResultIndex(1);
                    return;
                } else if (e.keyCode === KeyCodes.KeyDown.UpArrow) {
                    that.setSelectedResultIndex(-1);
                    return;
                }
            }

            if (e.keyCode !== KeyCodes.KeyDown.Enter){
                // after a delay, show autocomplete list.
                typewatch(() => {

                    var val = that.getTerms();

                    // if there are more than x chars and no spaces
                    // update the autocomplete list.
                    if (val && val.length > that.minChars && !val.contains(' ')) {
                        that.search(val);
                    } else {
                        // otherwise, hide the autocomplete list.
                        that.clearResults();
                        that.hideResults();
                    }

                }, that.delay);
            }

        });

        // hide results if clicked outside.
        $(document).on('mouseup', (e) => {
            if (this.$searchResultsList.parent().has($(e.target)[0]).length === 0) {
                this.clearResults();
                this.hideResults();
            }
        });

        this.hideResults();
    }

    isValidKeyDown(e: KeyboardEvent): boolean {
        return this.validKeyDownCodes.contains(Utils.Keyboard.GetCharCode(e));
    }

    isValidKeyPress(e: KeyboardEvent): boolean {
        // is alphanumeric
        var regExp = /^[a-zA-Z0-9]*$/;
        var key = String.fromCharCode(Utils.Keyboard.GetCharCode(e));
        return regExp.test(key);
    }

    getTerms(): string {
        return this.$element.val().trim();
    }

    setSelectedResultIndex(direction): void {

        var nextIndex;

        if (direction === 1) {
            nextIndex = this.selectedResultIndex + 1;
        } else {
            nextIndex = this.selectedResultIndex - 1;
        }

        var $items = this.$searchResultsList.find('li');

        if (nextIndex < 0) {
            nextIndex = $items.length - 1;
        } else if (nextIndex > $items.length - 1) {
            nextIndex = 0;
        }

        this.selectedResultIndex = nextIndex;

        $items.removeClass('selected');

        var selectedItem = $items.eq(this.selectedResultIndex);

        selectedItem.addClass('selected');

        //var top = selectedItem.offset().top;
        var top = selectedItem.outerHeight(true) * this.selectedResultIndex;

        this.$searchResultsList.scrollTop(top);
    }

    search(term: string): void {

        this.results = [];

        this.clearResults();
        this.showResults();
        this.$searchResultsList.append('<li class="loading"></li>');

        this.updateListPosition();

        var that = this;

        this.autoCompleteFunc(term, (results: string[]) => {
           that.listResults(results);
        });
    }

    clearResults(): void {
        this.$searchResultsList.empty();
    }

    hideResults(): void {
        this.$searchResultsList.hide();
    }

    showResults(): void {
        this.selectedResultIndex = -1;
        this.$searchResultsList.show();
    }

    updateListPosition(): void {
        if (this.positionAbove){
            this.$searchResultsList.css({
                'top': this.$searchResultsList.outerHeight(true) * -1
            });
        } else {
            this.$searchResultsList.css({
                'top': this.$element.outerHeight(true)
            });
        }
    }

    listResults(results: string[]): void {
        // get an array of strings
        this.results = this.parseResultsFunc(results);

        this.clearResults();

        if (!this.results.length) {
            // don't do this, because there still may be results for the PHRASE but not the word.
            // they won't know until they do the search.
            //this.searchResultsList.append('<li>no results</li>');
            this.hideResults();
            return;
        }

        for (var i = 0; i < this.results.length; i++) {
            var result = this.results[i];

            var $resultItem = this.$searchResultTemplate.clone();

            var $a = $resultItem.find('a');

            $a.text(result);

            this.$searchResultsList.append($resultItem);
        }

        this.updateListPosition();

        var that = this;

        this.$searchResultsList.find('li').on('click', function (e) {
            e.preventDefault();

            that.searchForItem($(this));
        });
    }

    searchForItem($item): void {
        var term = $item.find('a').text();

        this.$element.val(term);
        this.hideResults();

        this.onSelect(term);

        this.clearResults();
        this.hideResults();
    }

    getSelectedListItem() {
        return this.$searchResultsList.find('li.selected');
    }

}

export = AutoComplete;