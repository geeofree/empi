import { Fragment, ReactNode } from "react"
import { View, Text, StyleSheet, StatusBar } from "react-native"
import Feather from "@expo/vector-icons/Feather"
import { useNavigation } from "@react-navigation/native"

import { getFontSize, getSpacing } from "../style"
import { Navigation } from "../App"

export type HeaderProps = {
  left?: ReactNode
  right?: ReactNode
  title: string
  children?: ReactNode
}

function Header(props: HeaderProps) {
  const { title, children, left, right } = props
  const navigator = useNavigation<Navigation>()

  const backButton = (
    <Feather
      name="arrow-left"
      style={[styles.icons, styles.paddingRight]}
      onPress={navigator.goBack}
    />
  )
  const leftContent = left === undefined ? backButton : left

  const defaultRightContent = (
    <View style={styles.rightContent}>
      <Feather
        name="list"
        style={styles.icons}
        onPress={() => navigator.push('Playlists')}
      />
    </View>
  )
  const rightContent = right === undefined ? defaultRightContent : right

  let content: ReactNode = (
    <Fragment>
      {leftContent}
      <Text style={styles.title}>{title}</Text>
      {rightContent}
    </Fragment>
  )

  if (children) {
    content = children
  }
  
  return <View style={styles.header}>{content}</View>
}

const styles = StyleSheet.create({
  header: {
    elevation: 1,
    padding: getSpacing(4),
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: (StatusBar.currentHeight || 0) + getSpacing(3),
  },
  title: {
    fontFamily: 'Inter',
    flex: 2,
    fontSize: getFontSize(3),
  },
  icons: {
    fontSize: getFontSize(4)
  },
  paddingRight: {
    paddingRight: getSpacing(4),
  },
  rightContent: {
    flexDirection: 'row',
    paddingLeft: getSpacing(3),
  },
})


export default Header
