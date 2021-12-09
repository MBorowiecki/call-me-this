import React from 'react';
import { Text, View } from "react-native";
import styled from 'styled-components';

const CardViewStyled = styled(View)`
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 16px;
    min-width: 150px;
`

const CardTitleStyled = styled(View)`
    border-bottom-color: #020202;
    border-bottom-width: 1px;
    padding-bottom: 8px;
    margin-bottom: 8px;
`

const CardTitleTextStyled = styled(Text)`
    font-size: 24px;
    color: #020202;
    font-weight: 700;
    text-align: center;
`

export const CardViewPrimary: React.FC = ({
    children
}) => {
    return (
        <CardViewStyled>
            {children}
        </CardViewStyled>
    )
}

export const CardTitle: React.FC = ({
    children
}) => {
    return (
        <CardTitleStyled>
            <CardTitleTextStyled>{children}</CardTitleTextStyled>
        </CardTitleStyled>
    )
}