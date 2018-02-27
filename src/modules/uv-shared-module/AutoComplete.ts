
export class AutoComplete {

	private _results: any;
	private _selectedResultIndex: number;
    private _$element: JQuery;
    private _autoCompleteFunc: (terms: string, cb: (results: string[]) => void) => void;
    private _delay: number;
    private _minChars: number;
    private _onSelect: (terms: string) => void;
    private _parseResultsFunc: (results: string[]) => string[];
    private _positionAbove: boolean;
    private _allowWords: boolean;

	private _$searchResultsList: JQuery;
	private _$searchResultTemplate: JQuery;

    constructor(element: JQuery,
                autoCompleteFunc: (terms: string, cb: (results: string[]) => void) => void,
                parseResultsFunc: (results: any) => string[],
                onSelect: (terms: string) => void,
                delay: number = 300,
                minChars: number = 2,
                positionAbove: boolean = false,
                allowWords: boolean = false) {

        this._$element = element;
        this._autoCompleteFunc = autoCompleteFunc;
        this._delay = delay;
        this._minChars = minChars;
        this._onSelect = onSelect;
        this._parseResultsFunc = parseResultsFunc;
        this._positionAbove = positionAbove;
        this._allowWords = allowWords;

        // create ui.
        this._$searchResultsList = $('<ul class="autocomplete"></ul>');

        if (this._positionAbove) {
            this._$element.parent().prepend(this._$searchResultsList);
        } else {
            this._$element.parent().append(this._$searchResultsList);
        }

        this._$searchResultTemplate = $('<li class="result"><a href="#" tabindex="-1"></a></li>');

        // init ui.

        // callback after set period.
        const typewatch = (function () {
            let timer: number = 0;
            return function (cb: Function, ms: number) {
                clearTimeout(timer);
                timer = setTimeout(cb, ms);
            };
        })();

        const that = this;

        this._$element.on("keydown", function(e: JQueryEventObject) {

            const originalEvent: KeyboardEvent = <KeyboardEvent>e.originalEvent;
            //that._lastKeyDownWasNavigation = that._isNavigationKeyDown(originalEvent);
            const charCode: number = Utils.Keyboard.getCharCode(originalEvent);
            let cancelEvent: boolean = false;

            if (charCode === KeyCodes.KeyDown.LeftArrow) {
                cancelEvent = true;
            } else if (charCode === KeyCodes.KeyDown.RightArrow){
                cancelEvent = true;
            }

            if (cancelEvent) {
                originalEvent.cancelBubble = true;
                if(originalEvent.stopPropagation) originalEvent.stopPropagation();
            }
        });

        // auto complete
        this._$element.on("keyup", function(e) {

            // if pressing enter without a list item selected
            if (!that._getSelectedListItem().length && e.keyCode === KeyCodes.KeyDown.Enter) { // enter
                that._onSelect(that._getTerms());
                return;
            }

            // If there are search results
            if (that._$searchResultsList.is(':visible') && that._results.length) {
                if (e.keyCode === KeyCodes.KeyDown.Enter) {
                    that._searchForItem(that._getSelectedListItem());
                } else if (e.keyCode === KeyCodes.KeyDown.DownArrow) {
                    that._setSelectedResultIndex(1);
                    return;
                } else if (e.keyCode === KeyCodes.KeyDown.UpArrow) {
                    that._setSelectedResultIndex(-1);
                    return;
                }
            }

            if (e.keyCode !== KeyCodes.KeyDown.Enter) {
                // after a delay, show autocomplete list.
                typewatch(() => {

                    const val = that._getTerms();

                    // if there are more than x chars
                    // update the autocomplete list.
                    if (val && val.length > that._minChars && that._searchForWords(val)) {
                        that._search(val);
                    } else {
                        // otherwise, hide the autocomplete list.
                        that._clearResults();
                        that._hideResults();
                    }

                }, that._delay);
            }

        });

        // hide results if clicked outside.
        $(document).on('mouseup', (e) => {
            if (this._$searchResultsList.parent().has($(e.target)[0]).length === 0) {
                this._clearResults();
                this._hideResults();
            }
        });

        this._hideResults();
    }

    private _searchForWords(search: string): boolean {
      if (this._allowWords || !search.includes(' ')) {
        return true;
      } else {
        return false;
      }
    }

    private _getTerms(): string {
        return this._$element.val().trim();
    }

    private _setSelectedResultIndex(direction: number): void {

        let nextIndex: number;

        if (direction === 1) {
            nextIndex = this._selectedResultIndex + 1;
        } else {
            nextIndex = this._selectedResultIndex - 1;
        }

        const $items: JQuery = this._$searchResultsList.find('li');

        if (nextIndex < 0) {
            nextIndex = $items.length - 1;
        } else if (nextIndex > $items.length - 1) {
            nextIndex = 0;
        }

        this._selectedResultIndex = nextIndex;

        $items.removeClass('selected');

        const $selectedItem: JQuery = $items.eq(this._selectedResultIndex);

        $selectedItem.addClass('selected');

        const top = $selectedItem.outerHeight(true) * this._selectedResultIndex;

        this._$searchResultsList.scrollTop(top);
    }

    private _search(term: string): void {

        this._results = [];

        this._clearResults();
        this._showResults();
        this._$searchResultsList.append('<li class="loading"></li>');

        this._updateListPosition();

        const that = this;

        this._autoCompleteFunc(term, (results: string[]) => {
           that._listResults(results);
        });
    }

    private _clearResults(): void {
        this._$searchResultsList.empty();
    }

    private _hideResults(): void {
        this._$searchResultsList.hide();
    }

    private _showResults(): void {
        this._selectedResultIndex = -1;
        this._$searchResultsList.show();
    }

    private _updateListPosition(): void {
        if (this._positionAbove) {
            this._$searchResultsList.css({
                'top': this._$searchResultsList.outerHeight(true) * -1
            });
        } else {
            this._$searchResultsList.css({
                'top': this._$element.outerHeight(true)
            });
        }
    }

    private _listResults(results: string[]): void {
        // get an array of strings
        this._results = this._parseResultsFunc(results);

        this._clearResults();

        if (!this._results.length) {
            // don't do this, because there still may be results for the PHRASE but not the word.
            // they won't know until they do the search.
            //this.searchResultsList.append('<li>no results</li>');
            this._hideResults();
            return;
        }

        for (let i = 0; i < this._results.length; i++) {
            const result = this._results[i];
            const $resultItem = this._$searchResultTemplate.clone();
            const $a = $resultItem.find('a');
            $a.text(result);
            this._$searchResultsList.append($resultItem);
        }

        this._updateListPosition();

        const that = this;

        this._$searchResultsList.find('li').on('click', function (e: any) {
            e.preventDefault();
            that._searchForItem($(this));
        });
    }

    private _searchForItem($item: JQuery): void {
        const term: string = $item.find('a').text();
        this._$element.val(term);
        this._hideResults();
        this._onSelect(term);
        this._clearResults();
        this._hideResults();
    }

    private _getSelectedListItem() {
        return this._$searchResultsList.find('li.selected');
    }

}
