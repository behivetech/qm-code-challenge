// VENDOR LIBS
var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');
var _ = require('lodash');

// CORE LIBS
var browser = require('lib-browser/browser');
var Focus = require('lib-browser/focus');
var keyCode = require('lib-core/input/key-code');

// CORE COMPONENTS
var Button = require('components-ui-core/button');
var config = require('components-ui-core/config/config');
var ListItem = require('components-ui-core/list-item');

// MIXINS
var AccessibilityMixin = require('components-ui-core/mixins/accessibility-mixin');

var Menu = React.createClass({
    mixins: [AccessibilityMixin],

    propTypes: {
        items: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                content: React.PropTypes.node,
                props: React.PropTypes.object,
            })
        ).isRequired,

        defaultTabbableIndex: React.PropTypes.number,
        firstIndex: React.PropTypes.number,
        maxItemsToDisplay: React.PropTypes.number,
        scrollDelay: React.PropTypes.number,
        selectedIndex: React.PropTypes.number,
        swipeItemHeight: React.PropTypes.number,

        ariaSelectedEnabled: React.PropTypes.bool,
        clickSelectable: React.PropTypes.bool,
        ctrlKeyEnabled: React.PropTypes.bool,
        cycledNavigation: React.PropTypes.bool,
        directionArrowsDisplayed: React.PropTypes.bool,
        focusableElements: React.PropTypes.bool,
        focusOnSelect: React.PropTypes.bool,
        horizontalMenu: React.PropTypes.bool,
        hoverable: React.PropTypes.bool,
        hoverSelectable: React.PropTypes.bool,
        keyboardSupported: React.PropTypes.bool,
        letterNavigation: React.PropTypes.bool,
        scrollable: React.PropTypes.bool,
        selectable: React.PropTypes.bool,
        selectItemOnSelectionMove: React.PropTypes.bool,
        selectionMoveDelay: React.PropTypes.number,

        ariaLabelArrowDown: React.PropTypes.string,
        ariaLabelArrowUp: React.PropTypes.string,
        defaultItemRole: React.PropTypes.string,

        onHover: React.PropTypes.func,
        onItemClick: React.PropTypes.func,
        onItemSelect: React.PropTypes.func,
        onKeyDown: React.PropTypes.func,
        onSelectionMove: React.PropTypes.func,
    },

    getDefaultProps: function () {
        return _.extend(
            {
                ariaSelectedEnabled: true,
                clickSelectable: true,
                ctrlKeyEnabled: false,
                cycledNavigation: false,
                directionArrowsDisplayed: true,
                focusableElements: false,
                focusToItemOnSelect: true,
                horizontalMenu: false,
                hoverable: true,
                hoverSelectable: true,
                keyboardSupported: true,
                letterNavigation: true,
                scrollable: true,
                selectable: true,
                selectItemOnSelectionMove: true,
                selectionMoveDelay: 200,

                defaultItemRole: 'menuitem',
                role: 'menu',

                firstIndex: 0,
                scrollDelay: 300,
                selectedIndex: 0,
                swipeItemHeight: 30,
            },
            config.get('Menu')
        );
    },

    componentWillMount: function () {
        this.moveSelectionToNewState = _.throttle(
            this.moveSelectionToNewState,
            this.props.selectionMoveDelay
        );
    },

    componentWillReceiveProps: function (nextProps) {
        var selectedIndex = _.isUndefined(nextProps.defaultTabbableIndex)
            ? nextProps.selectedIndex
            : nextProps.defaultTabbableIndex;

        if (!_.isUndefined(selectedIndex) && !_.isNull(selectedIndex)) {
            this.setState({
                selectedIndex: selectedIndex,
                firstIndex:
                    this.props.items.length !== nextProps.items.length
                        ? 0
                        : this.getFirstIndexForNextSelectedIndex(
                              this.state.firstIndex,
                              selectedIndex
                          ),
            });
        }
    },

    getInitialState: function () {
        var firstIndex = this.props.firstIndex;

        if (!firstIndex && this.props.selectedIndex >= this.getMaxItemsToDisplay()) {
            firstIndex = this.props.selectedIndex;

            if (firstIndex > this.getLastFirstIndex()) {
                firstIndex = this.getLastFirstIndex();
            }
        }

        return {
            firstIndex: firstIndex,
            selectedIndex: this.props.selectedIndex,
            scrollInterval: 0,
            touchMovement: 0,
            touchPosition: 0,
        };
    },

    render: function () {
        return (
            <div {...this.getProps()}>
                {this.renderArrow('up', this.handleUpArrow)}
                <ul {...this.getListProps()}>{this.props.items.map(this.renderItem)}</ul>
                {this.renderArrow('down', this.handleDownArrow)}
            </div>
        );
    },

    renderArrow: function (direction, clickCallback) {
        var arrowButton = null;
        var hasItemsOverflow = this.props.items.length > this.getMaxItemsToDisplay();

        if (
            this.props.directionArrowsDisplayed &&
            !browser.isTouchDevice() &&
            hasItemsOverflow
        ) {
            arrowButton = <Button {...this.getArrowProps(direction, clickCallback)} />;
        }

        return arrowButton;
    },

    renderItem: function (item, index) {
        var listItem;
        var listItemProps = this.getItemProps(item, index);

        if (this.isVisible(index)) {
            listItem = <ListItem {...listItemProps}>{item.content}</ListItem>;
        } else {
            listItem = <li {...this.getPlainListItemProps(listItemProps)} />;
        }

        return listItem;
    },

    getProps: function () {
        var props = _.extend({}, this.props);

        props.className = this.getClass();
        props.onWheel = this.handleWheel;
        props.onKeyDown = this.handleKeyDown;
        props.onKeyUp = this.handleKeyUp;
        props.onTouchStart = this.handleTouchStart;
        props.onTouchMove = this.handleTouchMove;
        props.onTouchEnd = this.handleTouchEnd;
        props.role = null;
        props.id = null;

        return props;
    },

    getPlainListItemProps: function (listItemProps) {
        var props = _.extend({}, listItemProps);

        if (props.disabled && !props.checkbox) {
            props.role = null;
        }

        return props;
    },

    getArrowProps: function (direction, clickCallback) {
        return {
            'aria-label':
                direction === 'down'
                    ? this.props.ariaLabelArrowDown
                    : this.props.ariaLabelArrowUp,
            buttonType: 'vertical-menu',
            className: this.getArrowClass(direction),
            disabled: this.isArrowDisabled(direction),
            onClick: clickCallback,
            onMouseOut: this.clearScrollInterval,
            onMouseUp: this.clearScrollInterval,
            onMouseDown: this.setScrollInterval.bind(this, clickCallback),
            prefixIcon:
                direction === 'down'
                    ? 'swa-icon_arrow-down-solid'
                    : 'swa-icon_arrow-up-solid',
        };
    },

    getArrowClass: function (direction) {
        var classes = {
            'menu--vertical-arrow': true,
            'menu--vertical-arrow-down': direction === 'down',
            'menu--vertical-arrow-up': direction === 'up',
        };

        return classNames(classes);
    },

    getListProps: function () {
        return {
            className: 'menu--item-list',
            role: this.props.role,
            id: this.props.id,
            'aria-label': this.props['aria-label'],
            'aria-labelledby': this.props['aria-labelledby'],
            'aria-describedby': this.props['aria-describedby'],
            'aria-multiselectable': this.props['aria-multiselectable'],
        };
    },

    getItemProps: function (item, index) {
        var props = _.extend({}, item.props);
        var ariaType = this.getAriaType(props);
        var tabbable = !_.isUndefined(this.props.defaultTabbableIndex)
            ? this.isTabbableIndex(index)
            : this.isFocusable(index);

        props.className = this.getItemClass(item, index);
        props.key = props.key || index;
        props.role = props.role || this.props.defaultItemRole;

        if (this.props.ariaSelectedEnabled) {
            props[ariaType] = this.isSelected(index);
        }

        if (!props.disabled && this.isVisible(index)) {
            props.onClick = this.handleClick.bind(this, index);
            props.onMouseOver = this.handleItemHover.bind(this, index);
            props.onFocus = this.handleItemFocus.bind(this, index);
            props.selected = _.isUndefined(props.selected)
                ? this.isSelected(index)
                : props.selected;
            props.tabIndex = this.props.focusableElements || tabbable ? null : -1;
        }

        if (index === this.state.selectedIndex) {
            props.ref = 'selectedNode';
        }

        return props;
    },

    getClass: function () {
        var classes = {
            menu: true,
            menu_horizontal: this.props.horizontalMenu,
            'menu_horizontal-no-padding':
                this.props.buttonType === 'tab-light-bordered-large',
        };

        classes[this.props.className] = this.props.className;

        return classNames(classes);
    },

    getItemClass: function (item, index) {
        var classes = {
            'swa-g-screen-reader-only': !this.isVisible(index),
        };
        var props = item.props;

        if (props) {
            classes[props.className] = props.className;
        }

        return classNames(classes);
    },

    getAriaType: function (props) {
        var ariaType;

        if (props.buttonType === 'toggle' && props.childrenRole !== 'tab') {
            ariaType = 'aria-pressed';
        } else if (this.props.defaultItemRole === 'option') {
            ariaType = 'aria-selected';
        }

        return ariaType;
    },

    handleItemFocus: function (index) {
        if (
            !_.isUndefined(this.props.defaultTabbableIndex) ||
            this.props.focusableElements
        ) {
            this.setState({
                selectedIndex: index,
            });
        }
    },

    handleUpArrow: function () {
        if (this.isFirstItem()) {
            this.clearScrollInterval();
        } else {
            this.moveUp();
        }
    },

    handleDownArrow: function () {
        if (this.isLastItem()) {
            this.clearScrollInterval();
        } else {
            this.moveDown();
        }
    },

    handleItemHover: function (index) {
        if (this.props.selectable && this.props.hoverable) {
            if (this.props.hoverSelectable) {
                this.setState({selectedIndex: index}, this.handleItemSelect);
            } else {
                this.setState({selectedIndex: index}, this.focusCurrentSelectedItem);
            }
        }

        if (this.props.onHover) {
            this.props.onHover(index);
        }
    },

    handleClick: function (index, event) {
        if (this.props.selectable && this.props.clickSelectable && !this.state.scrolled) {
            this.setState({selectedIndex: index}, this.handleItemSelect);
        }

        if (this.props.onItemClick) {
            this.props.onItemClick(index);
        }

        if (this.props.items[index].props && this.props.items[index].props.onClick) {
            this.props.items[index].props.onClick(event);
        }
    },

    handleKeyDown: function (event) {
        var pressedKey = event.which;
        var keyActions = this.getSpecialKeyActions(event);

        if (
            (this.props.keyboardSupported && keyActions[pressedKey]) ||
            this.isCtrlKeyEnabled(event)
        ) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (this.props.keyboardSupported) {
            if (keyActions[pressedKey]) {
                keyActions[pressedKey]();
            } else if (this.props.letterNavigation && this.isAlphaChar(pressedKey)) {
                if (pressedKey >= keyCode.NUMPAD_ZERO) {
                    this.selectNextItemByAlphaKey(pressedKey - keyCode.ZERO);
                } else {
                    this.selectNextItemByAlphaKey(pressedKey);
                }
            }
        }

        if (this.props.onKeyDown) {
            this.props.onKeyDown(event);
        }
    },

    handleKeyUp: function (event) {
        var keyPressed = event.which;

        if (this.props.keyboardSupported && this.isCtrlKeyEnabled(event)) {
            event.preventDefault();
            event.stopPropagation();

            if (keyPressed === keyCode.PAGE_UP) {
                this.moveSelectionUp();
            } else if (keyPressed === keyCode.PAGE_DOWN) {
                this.moveSelectionDown();
            }
        }
    },

    moveSelectionUp: function () {
        var nextFirstIndex;
        var nextSelectedIndex;
        var state;

        if (this.props.selectable) {
            if (
                this.props.cycledNavigation &&
                this.state.selectedIndex === this.getFirstEnabledIndex()
            ) {
                nextSelectedIndex = this.getLastEnabledIndex();
                nextFirstIndex = this.getFirstIndexForNextSelectedIndex(
                    this.state.firstIndex,
                    nextSelectedIndex
                );

                state = {
                    selectedIndex: nextSelectedIndex,
                    firstIndex: nextFirstIndex,
                };
            } else {
                nextSelectedIndex = this.findNextSelectableItemIndexWithOffset(-1);
                state = {selectedIndex: nextSelectedIndex};

                if (!this.isVisible(nextSelectedIndex)) {
                    this.moveUp(this.state.firstIndex - nextSelectedIndex);
                }
            }
            this.moveSelectionToNewState(state);
        }
    },

    moveSelectionDown: function () {
        var nextSelectedIndex;
        var nextFirstIndex;
        var state;

        if (this.props.selectable) {
            if (
                this.props.cycledNavigation &&
                this.state.selectedIndex === this.getLastEnabledIndex()
            ) {
                nextSelectedIndex = this.getFirstEnabledIndex();
                nextFirstIndex = this.getFirstIndexForNextSelectedIndex(
                    this.state.firstIndex,
                    nextSelectedIndex
                );

                state = {
                    selectedIndex: nextSelectedIndex,
                    firstIndex: nextFirstIndex,
                };
            } else {
                nextSelectedIndex = this.findNextSelectableItemIndexWithOffset(1);
                state = {selectedIndex: nextSelectedIndex};

                if (!this.isVisible(nextSelectedIndex)) {
                    this.moveDown(
                        nextSelectedIndex -
                            (this.state.firstIndex + this.getMaxItemsToDisplay() - 1)
                    );
                }
            }

            this.moveSelectionToNewState(state);
        }
    },

    moveSelectionTop: function () {
        var nextSelectedIndex = this.getFirstEnabledIndex();
        var nextFirstIndex = this.getFirstIndexForNextSelectedIndex(
            this.state.firstIndex,
            nextSelectedIndex
        );

        this.moveSelectionToNewState({
            firstIndex: nextFirstIndex,
            selectedIndex: nextSelectedIndex,
        });
    },

    moveSelectionBottom: function () {
        var nextSelectedIndex = this.getLastEnabledIndex();
        var nextFirstIndex = this.getFirstIndexForNextSelectedIndex(
            this.state.firstIndex,
            nextSelectedIndex
        );

        this.moveSelectionToNewState({
            firstIndex: nextFirstIndex,
            selectedIndex: nextSelectedIndex,
        });
    },

    movePage: function (move) {
        var moveUp = move === 'up';
        var items = this.props.items;
        var maxItemsToDisplay = this.getMaxItemsToDisplay();
        var nextSelectedIndex;
        var nextFirstIndex = this.state.firstIndex;
        var slicedItems = moveUp
            ? items.slice(nextFirstIndex, this.state.selectedIndex)
            : items.slice(
                  this.state.selectedIndex + 1,
                  nextFirstIndex + maxItemsToDisplay
              );

        if (!this.hasEnabledItem(slicedItems)) {
            nextFirstIndex += (moveUp ? -1 : 1) * maxItemsToDisplay;
        }

        nextSelectedIndex = nextFirstIndex;
        nextSelectedIndex += !moveUp ? maxItemsToDisplay - 1 : 0;

        nextFirstIndex = Math.max(
            Math.min(nextFirstIndex, items.length - maxItemsToDisplay),
            0
        );
        nextSelectedIndex = Math.max(Math.min(nextSelectedIndex, items.length - 1), 0);

        if (!this.isItemSelectable(nextSelectedIndex)) {
            nextSelectedIndex = this.findNextSelectableItemIndexWithOffset(
                moveUp ? 1 : -1,
                nextSelectedIndex
            );
        }

        nextFirstIndex = this.getFirstIndexForNextSelectedIndex(
            nextFirstIndex,
            nextSelectedIndex
        );

        this.moveSelectionToNewState({
            firstIndex: nextFirstIndex,
            selectedIndex: nextSelectedIndex,
        });
    },

    moveSelectionToNewState: function (newState) {
        this.setState(newState, this.handleSelectionMove);
    },

    getFirstEnabledIndex: function () {
        return this.isItemSelectable(0)
            ? 0
            : this.findNextSelectableItemIndexWithOffset(1, 0);
    },

    getLastEnabledIndex: function () {
        var lastIndex = this.props.items.length - 1;

        return this.isItemSelectable(lastIndex)
            ? lastIndex
            : this.findNextSelectableItemIndexWithOffset(-1, lastIndex);
    },

    getFirstIndexForNextSelectedIndex: function (firstIndex, nextSelectedIndex) {
        var nextFirstIndex = firstIndex;
        var maxItemsToDisplay = this.getMaxItemsToDisplay();

        if (firstIndex > nextSelectedIndex) {
            nextFirstIndex = nextSelectedIndex;
        } else if (nextSelectedIndex > firstIndex + maxItemsToDisplay - 1) {
            nextFirstIndex = nextSelectedIndex - maxItemsToDisplay + 1;
        }

        return nextFirstIndex;
    },

    hasEnabledItem: function (items) {
        var enabledPosition = _.findIndex(items, function (item) {
            return item.props && !item.props.disabled;
        });

        return enabledPosition !== -1 && items.length;
    },

    isAlphaChar: function (key) {
        var keyInAlphaRange = keyCode.ZERO <= key && key <= keyCode.Z;

        if (!keyInAlphaRange) {
            keyInAlphaRange = keyCode.NUMPAD_ZERO <= key && key <= keyCode.NUMPAD_NINE;
        }

        return keyInAlphaRange;
    },

    selectNextItemByAlphaKey: function (key) {
        var nextSelectedIndex;
        var lastFirstItem = this.getLastFirstIndex();

        if (this.props.selectable) {
            nextSelectedIndex = this.findNextIndexByAlphaKey(key);

            if (!this.isVisible(nextSelectedIndex)) {
                if (nextSelectedIndex < this.state.firstIndex) {
                    this.moveUp(this.state.firstIndex - nextSelectedIndex);
                } else if (nextSelectedIndex > lastFirstItem) {
                    this.moveDown(lastFirstItem - this.state.firstIndex);
                } else {
                    this.moveDown(nextSelectedIndex - this.state.firstIndex);
                }
            }

            this.setState(
                {
                    selectedIndex: nextSelectedIndex,
                },
                this.handleSelectionMove
            );
        }
    },

    findNextIndexByAlphaKey: function (key) {
        var nextIndex;
        var startArray = this.props.items.slice(0, this.state.selectedIndex);
        var endArray = this.props.items.slice(
            this.state.selectedIndex + 1,
            this.props.items.length
        );

        nextIndex = _.findIndex(endArray, this.itemMatchesKey.bind(this, key));

        if (nextIndex === -1) {
            nextIndex = _.findIndex(startArray, this.itemMatchesKey.bind(this, key));
            nextIndex = nextIndex === -1 ? this.state.selectedIndex : nextIndex;
        } else {
            nextIndex += startArray.length + 1;
        }

        return nextIndex;
    },

    itemMatchesKey: function (key, item) {
        var itemHasString = typeof item.content === 'string';
        var itemMatchFirstKey =
            itemHasString && item.content.toUpperCase().charCodeAt(0) === key;
        var itemIsDisabled = item.props && item.props.disabled;

        return itemMatchFirstKey && !itemIsDisabled;
    },

    handleSelectionMove: function () {
        if (this.props.selectItemOnSelectionMove) {
            this.handleItemSelect();
        } else if (this.props.onSelectionMove) {
            this.props.onSelectionMove(this.state.selectedIndex);
        }

        this.focusCurrentSelectedItem();
    },

    handleWheel: function (event) {
        if (this.isScrollable()) {
            event.preventDefault();

            event.deltaY < 0 ? this.moveUp() : this.moveDown();
        }
    },

    handleTouchStart: function (event) {
        if (this.isScrollable()) {
            this.setState({
                touchPosition: event.changedTouches[0].pageY,
            });
        }
    },

    handleTouchMove: function (event) {
        event.preventDefault();
        event.stopPropagation();

        var currentPosition = event.changedTouches[0].pageY;
        var delta = Math.round(
            this.state.touchMovement + (this.state.touchPosition - currentPosition)
        );

        if (this.isScrollable()) {
            if (Math.abs(delta) > this.props.swipeItemHeight) {
                delta > 0 ? this.moveDown() : this.moveUp();

                delta = 0;
            }

            this.setState({
                touchMovement: delta,
                touchPosition: currentPosition,
                scrolled: true,
            });
        }
    },

    handleTouchEnd: function () {
        if (this.isScrollable()) {
            this.setState({
                scrolled: false,
                touchMovement: 0,
                touchPosition: 0,
            });
        }
    },

    handleItemSelect: function () {
        this.focusCurrentSelectedItem();

        if (this.props.onItemSelect) {
            this.props.onItemSelect(this.state.selectedIndex);
        }
    },

    setScrollInterval: function (moveFunction) {
        var interval = setInterval(moveFunction, this.props.scrollDelay);

        this.setState({
            scrollInterval: interval,
        });
    },

    clearScrollInterval: function () {
        if (this.state.scrollInterval) {
            clearInterval(this.state.scrollInterval);

            this.setState({
                scrollInterval: 0,
            });
        }
    },

    isArrowDisabled: function (direction) {
        var disabled = false;
        var firstIndex = this.state.firstIndex;

        if (direction === 'up') {
            disabled = firstIndex === 0;
        } else if (direction === 'down') {
            disabled =
                firstIndex + this.getMaxItemsToDisplay() === this.props.items.length;
        }

        return disabled;
    },

    isCtrlKeyEnabled: function (event) {
        return this.props.ctrlKeyEnabled && event.ctrlKey;
    },

    isFirstItem: function () {
        return this.state.firstIndex === 0;
    },

    isFocusable: function (index) {
        return !this.props.keyboardSupported || this.isSelected(index);
    },

    isLastItem: function () {
        return (
            this.state.firstIndex + this.getMaxItemsToDisplay() ===
            this.props.items.length
        );
    },

    isScrollable: function () {
        return (
            this.props.scrollable && this.props.items.length > this.getMaxItemsToDisplay()
        );
    },

    isSelected: function (index) {
        return this.props.selectable && index === this.state.selectedIndex;
    },

    isTabbableIndex: function (index) {
        return this.props.selectable && index === this.props.defaultTabbableIndex;
    },

    isVisible: function (index) {
        return index >= this.state.firstIndex && index < this.getMaxIndex();
    },

    getMaxIndex: function () {
        return this.state.firstIndex + this.getMaxItemsToDisplay();
    },

    moveUp: function (times) {
        this.setState({firstIndex: this.previousIndex(times)});
    },

    moveDown: function (times) {
        this.setState({firstIndex: this.nextIndex(times)});
    },

    findNextSelectableItemIndexWithOffset: function (offset, startIndex) {
        var lowerLimit = 0;
        var upperLimit = this.props.items.length - 1;
        var nextSelectedIndex;

        startIndex =
            typeof startIndex === 'undefined' ? this.state.selectedIndex : startIndex;
        nextSelectedIndex = startIndex + offset;

        while (
            nextSelectedIndex < upperLimit &&
            nextSelectedIndex > lowerLimit &&
            !this.isItemSelectable(nextSelectedIndex)
        ) {
            nextSelectedIndex += offset;
        }

        if (nextSelectedIndex >= upperLimit) {
            nextSelectedIndex = upperLimit;
        } else if (nextSelectedIndex <= lowerLimit) {
            nextSelectedIndex = lowerLimit;
        }

        return this.isItemSelectable(nextSelectedIndex) ? nextSelectedIndex : startIndex;
    },

    isItemSelectable: function (nextSelectedIndex) {
        var itemProps = this.props.items[nextSelectedIndex].props || {};

        return itemProps.disabled === undefined || !itemProps.disabled;
    },

    nextIndex: function (offset) {
        offset = offset || 1;
        return this.isLastItem()
            ? this.getLastFirstIndex()
            : this.state.firstIndex + offset;
    },

    previousIndex: function (offset) {
        offset = offset || 1;
        return this.isFirstItem() ? 0 : this.state.firstIndex - offset;
    },

    getSpecialKeyActions: function (event) {
        var keyActions = {};

        keyActions[keyCode.UP] = this.moveSelectionUp;
        keyActions[keyCode.LEFT] = this.moveSelectionUp;
        keyActions[keyCode.RIGHT] = this.moveSelectionDown;
        keyActions[keyCode.DOWN] = this.moveSelectionDown;
        keyActions[keyCode.HOME] = this.moveSelectionTop;
        keyActions[keyCode.END] = this.moveSelectionBottom;

        if (!this.isCtrlKeyEnabled(event)) {
            if (this.props.items.length > this.getMaxItemsToDisplay()) {
                keyActions[keyCode.PAGE_UP] = this.movePage.bind(this, 'up');
                keyActions[keyCode.PAGE_DOWN] = this.movePage.bind(this, 'down');
            } else {
                keyActions[keyCode.PAGE_UP] = this.moveSelectionTop;
                keyActions[keyCode.PAGE_DOWN] = this.moveSelectionBottom;
            }
        }

        if (!_.isUndefined(this.props.defaultTabbableIndex)) {
            keyActions[keyCode.TAB] = this.handleTabKey.bind(this, event);
        }

        return keyActions;
    },

    focusCurrentSelectedItem: function () {
        if (
            this.props.focusToItemOnSelect &&
            this.isVisible(this.state.selectedIndex) &&
            this.refs.selectedNode &&
            this.refs.selectedNode.focus
        ) {
            this.refs.selectedNode.focus();
        }
    },

    getLastFirstIndex: function () {
        return this.props.items.length - this.getMaxItemsToDisplay();
    },

    getMaxItemsToDisplay: function () {
        var maxItemsToDisplay = this.props.maxItemsToDisplay;

        if (!maxItemsToDisplay || maxItemsToDisplay > this.props.items.length) {
            maxItemsToDisplay = this.props.items.length;
        }

        return maxItemsToDisplay;
    },

    //TODO: refactor this method when the second selected logic is inside menu
    handleTabKey: function (event) {
        var tabbableItemNode = Focus.getFirstFocusableChild(ReactDOM.findDOMNode(this));

        if (event.shiftKey) {
            Focus.focusPreviousFocusable(
                browser.getBrowserDocument().body,
                tabbableItemNode
            );
        } else {
            Focus.focusNextFocusable(browser.getBrowserDocument().body, tabbableItemNode);
        }
    },
});

module.exports = Menu;
