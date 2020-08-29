import React, { Component, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import LazyLoad from 'react-lazyload';
import { Icon, Input } from 'element-react';
import _ from 'lodash';

import { IFile } from '~/models';

import styles from './styles.scss';

interface IProps extends HTMLAttributes<HTMLSpanElement> {
	readonly onChange: (search: string) => void;
}

interface IState {
	search: string;
}

class Search extends Component<IProps, IState> {
	public static defaultProps: IProps = {
		onChange: (search: string): void => {
			/**/
		},
	};
	public props: IProps;
	public state: IState;

	private debounce: () => void = _.debounce((): void => this.props.onChange(this.state.search), 500);

	public constructor(props: IProps) {
		super(props);

		this.state = {
			search: '',
		};
	}

	public render(): ReactNode {
		return (
			<Input
				style={{ minWidth: '100px' }}
				icon="search"
				value={this.state.search}
				onChange={(search: any): void => this.setState({ search }, (): void => this.debounce())}
			/>
		);
	}
}

export default Search;
