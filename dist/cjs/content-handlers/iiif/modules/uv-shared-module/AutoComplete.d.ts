export declare class AutoComplete {
    private _results;
    private _selectedResultIndex;
    private _$element;
    private _autoCompleteFunc;
    private _delay;
    private _minChars;
    private _onSelect;
    private _parseResultsFunc;
    private _positionAbove;
    private _allowWords;
    private _$searchResultsList;
    private _$searchResultTemplate;
    constructor(element: JQuery, autoCompleteFunc: (terms: string, cb: (results: string[]) => void) => void, parseResultsFunc: (results: any) => string[], onSelect: (terms: string) => void, delay?: number, minChars?: number, positionAbove?: boolean, allowWords?: boolean);
    private _searchForWords;
    private _getTerms;
    private _setSelectedResultIndex;
    private _search;
    private _clearResults;
    private _hideResults;
    private _showResults;
    private _updateListPosition;
    private _listResults;
    private _searchForItem;
    private _getSelectedListItem;
}
