import React, { Component, ReactNode } from 'react';
import YouTube, { Options } from 'react-youtube';

interface IProps {
	readonly [key: string]: any;
}

interface IState {
	options: Options;
}

class About extends Component<IProps, IState> {
	public props: IProps;
	public state: IState;

	public constructor(props: IProps) {
		super(props);

		this.state = {
			options: {
				height: '390',
				width: '640',
				playerVars: {
					autoplay: 1,
				},
			},
		};
	}

	public render(): ReactNode {
		return (
			<div>
				<p>About</p>

				<YouTube videoId="P7fi4hP_y80" opts={this.state.options} />
			</div>
		);
	}
}

export default About;
