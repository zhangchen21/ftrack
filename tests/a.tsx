import React, { memo } from 'react';
import { Typography } from '@alifd/next';

const { H1, H2, Paragraph } = Typography;

export const ResultContent = memo((props) => {
	const { chineseName, description, methon } = props.bugData;
	const getHotData = (x) => {
		return x;
	};
	return (
		<div style={{ width: '100%' }}>
			<Typography >
				<H1>识别结果</H1>
				{
					props?.bugData
						?
						<div onClick={() => { getHotData(methon);}}>
							<H2>病态种类</H2>
							<Paragraph>{chineseName}</Paragraph>
							<H2>病态概览</H2>
							<Paragraph>{description}</Paragraph>
							<H2>防治方法</H2>
							<Paragraph>{methon}</Paragraph>
						</div>
						:
						<H2>未识别出病态</H2>
				}
			</Typography>
		</div>
	);
});