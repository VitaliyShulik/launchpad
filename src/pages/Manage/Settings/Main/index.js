import * as s from "../../../../styles/global";
import IPFS from './IPFS';
import Networks from './Networks';
import Contracts from './Contracts';


export default function Main() {
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
