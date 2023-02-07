import * as s from "../../../../styles/global";
import IPFS from './IPFS';
import Networks from './Networks';


export default function Main() {
  // TODO: Add MUI Accordion for the sections of the main settings
  return (
    <>
      <IPFS />
      <s.SpacerSmall />
      <Networks />
    </>
  )
}
