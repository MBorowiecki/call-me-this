import React from 'react';
import { TouchableNativeFeedback, View } from "react-native";
import styled from 'styled-components';
import { IButton } from './types';

const ButtonPrimaryStyled = styled(View)`
    background-color: #C06C84;
    align-items: center;
    padding: 8px 16px;
    border-radius: 10px;
`

const ButtonSecondaryStyled = styled(View)`
    background-color: rgba(0,0,0,0);
    align-items: center;
    padding: 8px 16px;
    border-radius: 10px;
`

export const ButtonPrimary: React.FC<IButton> = ({
    onPress,
    children
}) => {
    return (
        <TouchableNativeFeedback
            onPress={() => onPress && onPress()}
        >
            <ButtonPrimaryStyled>
                {children}
            </ButtonPrimaryStyled>
        </TouchableNativeFeedback>
    )
}

export const ButtonSecondary: React.FC<IButton> = ({
    onPress,
    children
}) => {
    return (
        <TouchableNativeFeedback
            onPress={() => onPress && onPress()}
        >
            <ButtonSecondaryStyled>
                {children}
            </ButtonSecondaryStyled>
        </TouchableNativeFeedback>
    )
}