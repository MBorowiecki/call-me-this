import React from 'react';
import { Text, View } from "react-native";
import styled from 'styled-components';
import { IBreakView, IBreakViewStyledProps } from './types';

const MainViewStyled = styled(View)`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #603030;
    height: 100%;
`

const BreakViewStyled = styled(View)`
    margin-bottom: ${(props: IBreakViewStyledProps) => props.margin}px;
`

export const MainView: React.FC = ({
    children
}) => {
    return (
        <MainViewStyled>
            {children}
        </MainViewStyled>
    )
}

export const BreakView: React.FC<IBreakView> = ({
    margin,
    children
}) => {
    const margins = {
        sm: 4,
        m: 8,
        lg: 12,
        xl: 16
    }

    return (
        <BreakViewStyled margin={margins[margin]} />
    )
}