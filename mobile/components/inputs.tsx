import React from 'react';
import { Text, TextInput } from "react-native";
import styled from 'styled-components';
import { ITextInputPrimary } from './types';

const TextInputPrimaryStyled = styled(TextInput)`
    background-color: #f0f0f0;
    padding: 8px 16px;
    min-width: 200px;
    border-width: 1px;
    border-radius: 10px;
`

export const TextInputPrimary: React.FC<ITextInputPrimary> = ({
    onTextChanged,
    placeholder,
    keyboardType,
    children
}) => {
    return (
        <TextInputPrimaryStyled
            placeholder={placeholder && placeholder}
            onChangeText={(text) => onTextChanged && onTextChanged(text)}
            keyboardType={keyboardType ? keyboardType : "default"}
        />
    )
}