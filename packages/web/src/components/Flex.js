import styled from 'styled-components'
import {typography, flexbox, color, space, layout, border, position} from 'styled-system'

const Flex = styled('div')(
  layout,
  space,
  color,
  flexbox,
  border,
  position,
  typography
)

export default Flex;
