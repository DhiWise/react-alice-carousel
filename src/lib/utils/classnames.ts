/* eslint-disable no-console */
import * as Utils from '.';
import { State, Classnames, Modifiers, Props } from '../types';

export const getRenderStageItemClasses = (i = 0, state: State, props: Props) => {
	const { fadeoutAnimationIndex } = state;
	const isActive = isActiveItem(i, state) ? Modifiers.ACTIVE : '';
	const isCloned = isClonedItem(i, state) ? Modifiers.CLONED : '';
	const isTarget = isTargetItem(i, state) ? Modifiers.TARGET : '';
	const isAnimated = i === fadeoutAnimationIndex ? Classnames.ANIMATED : '';
	const notCentered = isActive && notCenteredItem(i, state, props) ? `${Modifiers.CENTERED} ${props.scaleCss}` : '';

	return Utils.concatClassnames(Classnames.STAGE_ITEM, isActive, isCloned, isTarget, isAnimated, notCentered);
};

export const notCenteredItem = (i = 0, state: State, props: Props) => {
	const { itemsInSlide, itemsOffset } = state;
	const shiftIndex = Utils.getShiftIndex(itemsInSlide, itemsOffset);
	const actualIndex = i - shiftIndex;
	if (props?.magnifiedIndex !== undefined) {
		if ((state?.activeIndex + props.magnifiedIndex) >= state.itemsCount) {
			// console.log('greater: ', (state.activeIndex + props.magnifiedIndex - (state.itemsCount)), shiftIndex);
			return actualIndex !== (state.activeIndex + props.magnifiedIndex - (state.itemsCount));
		} else {
			// console.log('limits: ', state.activeIndex + props.magnifiedIndex, shiftIndex);
			return  actualIndex !== state.activeIndex + props.magnifiedIndex;
		}
	} 
	return false;
};

export const isActiveItem = (i = 0, state: State) => {
	const { activeIndex, itemsInSlide, itemsOffset, infinite, autoWidth } = state;
	const shiftIndex = Utils.getShiftIndex(itemsInSlide, itemsOffset);

	if (autoWidth && infinite) {
		return i - shiftIndex === activeIndex + itemsOffset;
	}

	const index = activeIndex + shiftIndex;

	// TODO !infinite
	if (!infinite) {
		return i >= activeIndex && i < index;
	}

	return i >= index && i < index + itemsInSlide;
};

export const isTargetItem = (i = 0, state: State) => {
	const { activeIndex, itemsInSlide, itemsOffset, infinite, autoWidth } = state;
	const shiftIndex = Utils.getShiftIndex(itemsInSlide, itemsOffset);

	if (!infinite) {
		return i === activeIndex;
	}

	if (autoWidth && infinite) {
		return i - shiftIndex === activeIndex + itemsOffset;
	}

	return i === activeIndex + shiftIndex;
};

export const isClonedItem = (i = 0, state: State) => {
	const { itemsInSlide, itemsOffset, itemsCount, infinite, autoWidth } = state;

	if (!infinite) {
		return false;
	}

	if (autoWidth && infinite) {
		return i < itemsInSlide || i > itemsCount - 1 + itemsInSlide;
	}

	const shiftIndex = Utils.getShiftIndex(itemsInSlide, itemsOffset);
	return i < shiftIndex || i > itemsCount - 1 + shiftIndex;
};
