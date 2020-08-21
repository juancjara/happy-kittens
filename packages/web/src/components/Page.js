import React from 'react'
import Flex from './Flex'

const Page = ({children}) => {
  return (
    <Flex flexDirection='column' flexGrow={1}>
      {children}
    </Flex>
  )
}

export default Page;
