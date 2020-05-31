import React from 'react';
import { Layout } from 'antd';
import Uploader from '../uploader/Uploader'
const { Content, Footer } = Layout;

function App() {
	return (
		<Layout style={{minHeight: '100vh' }}>
			<Content style={{ padding: '10px 10px' }}>
				<div style={{ padding: 24}}>
					<Uploader />
				</div>
			</Content>
			<Footer style={{ textAlign: 'center' }}>Alejandro Valladares 2019</Footer>
		</Layout>
	);
}

export default App;
