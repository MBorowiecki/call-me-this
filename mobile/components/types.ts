import React from "react";
import { KeyboardTypeOptions } from "react-native";

export interface ITextInputPrimary {
    placeholder?: string,
    onTextChanged?: (val: string) => void,
    keyboardType?: KeyboardTypeOptions,
    children?: React.ReactNode
}

export interface IButton {
    onPress?: () => void,
    children?: React.ReactNode
}

export interface IBreakView {
    margin: "sm" | "m" | "lg" | "xl",
    children?: React.ReactNode
}

export interface IBreakViewStyledProps {
    margin: number
}