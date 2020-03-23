import React from "react";
import InstagramEmbed from "react-instagram-embed";

import "./App.css";

class App extends React.Component {
	state = {
		insta: [],
		youtube: [],
		loading: true
	};
	componentDidMount() {
		this.fetchInstagramData();
		this.fetchYoutubeData();
	}

	fetchInstagramData = () => {
		fetch("https://www.instagram.com/explore/tags/livingroomsgottalent/?__a=1")
			.then(res => res.json())
			.then(data => {
				console.log(data.graphql.hashtag.edge_hashtag_to_media.edges);
				this.setState({
					insta: data.graphql.hashtag.edge_hashtag_to_media.edges
						.filter(video => video.node.is_video)
						.map(video => ({
							link: video.node.shortcode,
							views: video.node.video_view_count,
							likes: video.node.edge_liked_by.count,
							timestamp: video.node.taken_at_timestamp
						}))
				});
			});
	};
	filter = e => {
		const value = e.target.value;
		const filtered = this.state.insta.sort((a, b) => b[value] - a[value]);
		this.setState({ insta: filtered });
	};

	fetchYoutubeData = nextPage => {
		fetch(
			`https://www.googleapis.com/youtube/v3/search?part=snippet,id&q=livingroomsgottalent&maxResults=50&type=video&nextPageToken&key=AIzaSyDScYBnM5FCPZcoqqyVYLtKScLomQzn5FE` +
				(nextPage ? "&pageToken=" + nextPage : "")
		)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				this.setState({
					youtube: [
						...this.state.youtube,
						...(data.items || []).map(video => video.id.videoId)
					]
				});
				if (data.nextPageToken) {
					this.fetchYoutubeData(data.nextPageToken);
				} else {
					this.setState({ loading: false });
				}
			});
	};
	render() {
		if (this.state.loading) return <div>Loading...</div>;
		return (
			<div className="App">
				<div>Total Youtube Videos: {this.state.youtube.length}</div>
				<div>Total Insta Videos: {this.state.insta.length}</div>
				<div className="wrapper">
					<div className="videos">
						{this.state.youtube.map(video => {
							return (
								<iframe
									className="video"
									key={video}
									title={video}
									width="560"
									height="315"
									src={"https://www.youtube-nocookie.com/embed/" + video}
									frameBorder="0"
									allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
							);
						})}
					</div>

					<div>
						<div className="filters">
							<select onChange={this.filter}>
								<option value="timestamp">Newest</option>
								<option value="views">Most Viewed</option>
								<option value="likes">Most Lieked</option>
							</select>
						</div>
						<div className="videos">
							{this.state.insta.map(video => {
								return (
									<InstagramEmbed
										className="video"
										key={video.link}
										url={"https://instagr.am/p/" + video.link}
										maxWidth={320}
										hideCaption={false}
										containerTagName="div"
										protocol=""
										injectScript
										onLoading={() => {}}
										onSuccess={() => {}}
										onAfterRender={() => {}}
										onFailure={() => {}}
									/>
								);
							})}
						</div>
					</div>
				</div>

				{/*  */}
			</div>
		);
	}
}

export default App;
