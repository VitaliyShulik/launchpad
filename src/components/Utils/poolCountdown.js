import Countdown from "react-countdown";
import * as s from "../../styles/global";
const PoolCountdown = ({ start, end }) => {
  const dateNow = (parseInt(Date.now() / 1000));
  const isStarted = parseInt(start) < dateNow;
  const hasEnded = parseInt(end) < dateNow;

  if (hasEnded) {
    return null;
  }

  return (
    <s.Container fd="row" jc="space-between">
      <s.TextID>
        {isStarted ? "End in" : "Start in"}
      </s.TextID>
      <Countdown
        date={
          isStarted
            ? parseInt(end) * 1000
            : parseInt(start) * 1000
        }
      />
    </s.Container>
  );
};
export default PoolCountdown;
