import Countdown from "react-countdown";
import * as s from "../../styles/global";
const PoolCountdown = ({ start, end }) => {
  return (
    <s.Container fd="row" jc="space-between">
      <s.TextID>
        {parseInt(start) < new Date(Date.now() / 1000) ? "End in" : "Start in"}
      </s.TextID>
      <Countdown
        date={
          parseInt(start) < new Date(Date.now() / 1000)
            ? parseInt(end) * 1000
            : parseInt(start) * 1000
        }
      />
    </s.Container>
  );
};
export default PoolCountdown;
