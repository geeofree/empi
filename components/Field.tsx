import { useState } from "react"
import { NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputFocusEventData, TextInputProps, TextProps, View, ViewProps } from "react-native"
import { colors, getFontSize, getSpacing } from "../style"

export type FieldProps = {
  labelText: string
  label?: TextProps
  input?: TextInputProps
  container?: ViewProps
}

function Field(props: FieldProps) {
  const { labelText, label, input, container } = props
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = (evt: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true)
    if (typeof input?.onFocus === 'function') {
      input.onFocus(evt)
    }
  }

  const handleBlur = (evt: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false)
    if (typeof input?.onBlur === 'function') {
      input.onBlur(evt)
    }
  }

  return (
    <View {...container} style={[styles.container, container?.style]}>
      <Text {...label} style={[styles.label, label?.style]}>{labelText}</Text>
      <TextInput
        {...input}
        style={[styles.input, isFocused ? styles.inputFocused : null, input?.style]}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: getSpacing(5),
  },
  label: {
    fontSize: getFontSize(2),
    fontFamily: 'Inter',
    marginBottom: getSpacing(3),
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: getSpacing(2),
    borderColor: colors.bright.black,
    padding: getSpacing(3),
    fontFamily: 'Inter',
  },
  inputFocused: {
    borderColor: colors.normal.blue,
    borderWidth: 2,
  }
})

export default Field
