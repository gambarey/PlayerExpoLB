import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import color from '../misc/color';

const PlayerButton = props => {
    const { iconType,
        size = 55,
        iconColor = color.FONT,
        onPress } = props;
    const getIconName = (type) => {
        switch (type) {
            case 'play':
                return 'play-arrow';
            case 'pause':
                return 'pause';
            case 'forward':
                return 'skip-next';
            case 'backward':
                return 'skip-previous';
            default:
                return 'play-arrow';
        }
    };
    return (
        <MaterialIcons
            {...props}
            onPress={onPress}
            name={getIconName(iconType)}
            size={size}
            color={iconColor}
        />
    );
};

export default PlayerButton;
