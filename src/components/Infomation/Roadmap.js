import React from "react";
import * as s from "../../styles/global";

const Roadmap = (props) => {
    return(
        <s.Container jc = 'center' ai="center" fd='column' style={{ flexWrap: "wrap" }}>
            <s.TextTitle >Phase I</s.TextTitle>
            <s.Container jc="center" ai="center">
                <div>
                <s.TextDescription>• ICO</s.TextDescription>
                <s.TextDescription>• Alpha test</s.TextDescription>
                <s.TextDescription>• Built-in Marketplace</s.TextDescription>
                </div>
            </s.Container>
            <s.TextDescription>↓</s.TextDescription>
            <s.TextTitle >Phase II</s.TextTitle>
            <s.Container jc="center" ai="center">
                <div>
                <s.TextDescription>• Land Sale</s.TextDescription>
                <s.TextDescription>• Initialize DeFi Ecosystem</s.TextDescription>
                <s.TextDescription>• NFT Marketplace</s.TextDescription>
                </div>
            </s.Container>
            <s.TextDescription>↓</s.TextDescription>
            <s.TextTitle >Phase III</s.TextTitle>
            <s.Container jc="center" ai="center">
                <div>
                <s.TextDescription>• Metaverse Development</s.TextDescription>
                </div>
            </s.Container>
            <s.TextDescription>↓</s.TextDescription>
            <s.TextTitle >Phase IIII</s.TextTitle>
            <s.Container jc="center" ai="center">
                <div>
                <s.TextDescription>• Launch Final Version</s.TextDescription>
                <s.TextDescription>• Become opensource platform</s.TextDescription>
                <s.TextDescription>• Provided full decentralize Earning</s.TextDescription>
                </div>
            </s.Container>
        </s.Container>
    );
};
export default Roadmap;