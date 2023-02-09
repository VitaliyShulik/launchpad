import * as s from "../../../../styles/global";
import IPFS from './IPFS';
import Networks from './Networks';
import Contracts from './Contracts';


export default function Main() {
  // TODO: Add MUI Accordion for the sections of the main settings
  return (
    <>
      <IPFS />
      <s.SpacerSmall />
      <Networks />
      <s.SpacerSmall />
      <Contracts />
    </>
  )
}
