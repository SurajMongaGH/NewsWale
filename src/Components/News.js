import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export default class News extends Component {
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };

  constructor() {
    super();
    console.log("CONSTRUCTOR !!!");
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
    };
  }
  async componentDidMount() {
    this.updateNews();
  }

  async updateNews() {
    this.props.setProgress(10);
    const url = `http://api.mediastack.com/v1/news?access_key=5e927eed6e77b5ac7c6637ac665e0a94&categories=${this.props.category}&languages=en&offset=${this.state.page}&limit=24`;

    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: parsedData.data,
      totalResults: parsedData.pagination.results,
      loading: false,
    });
    this.props.setProgress(100);
  }
  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 24 });
    const url = `http://api.mediastack.com/v1/news?access_key=5e927eed6e77b5ac7c6637ac665e0a94&categories=${this.props.category}&languages=en&offset=${this.state.page}&limit=24`;

    //const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=d093053d72bc40248998159804e0e67d&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: this.state.articles.concat(parsedData.data),
      totalResults: parsedData.pagination.results,
    });
  };

  render() {
    console.log("RENDER !!!!");
    return (
      <>
      
      {this.state.loading && <Spinner />}
      <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
      > 
          <div className="container">
               
          <div className="row">
              {this.state.articles.map((element) => {
                  return <div className="col-md-4" key={element.url}>
                    <NewsItem
                  title={element.title}
                  description={element.description}
                  imageUrl={element.image}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.published_at}
                  source={element.source}
                />
                 </div>
              })}
          </div>
          </div> 
      </InfiniteScroll>

  </>
    );
  }
}
