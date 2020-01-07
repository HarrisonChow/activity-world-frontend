import React from 'react';
import { Upload, Icon, Modal } from 'antd';
import axios from 'axios';
import '../style/uploadimg.css';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class Uploadimg extends React.Component {
    state = {
      previewVisible: false,
      previewImage: '',
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }

      ],
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
      });
    };

    handleChange = (event) => {
      var formData = new FormData();
      for ( var key in event.file ) {
          formData.append(key, event.file[key]);
      }
      if (event.file.status === "removed") {
        var value = {
          key: event.file.uid
        };
        axios({
            method: 'post',
            url: 'http://13.55.208.161:3000/file/'+this.props.userId,
            data: value,
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
          if (response.statusText === "OK") {
            this.setState({ fileList: event.fileList });
          }
        }).catch((error) => {

        });

      } else if (event.file.status === "uploading") {
        axios.post(`http://13.55.208.161:3000/files/`+this.props.userId, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          let uploadData =[];
          let dataItem = {
            uid : response.data.Key,
            name : response.data.Key,
            status : 'done',
            url : "https://elasticbeanstalk-ap-southeast-2-706046992326.s3-ap-southeast-2.amazonaws.com/" + response.data.Key
          }

          uploadData.push(dataItem);
          var joined = this.state.fileList.concat(uploadData);
          this.setState({
            fileList: joined,
          });
        }).catch(error => {
          // handle your error
        });
      }
    }

    componentWillMount() {
      axios({
        method: 'get',
        url: 'http://13.55.208.161:3000/files/'+this.props.userId,
        withCredentials: true,
      }).then(response => {
          if (response.data.length > 0) {
            var joined = this.state.fileList.concat(response.data);
            this.setState({
              fileList: joined,
            });
          }
      }).catch((error) => {
      });
    }

    render() {
      const { previewVisible, previewImage, fileList } = this.state;
      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </div>
      );

      const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
          onSuccess("ok");
        }, 0);
      };

      return (
        <div className="uploadimg">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            customRequest={dummyRequest}
          >
            {fileList.length >= 10 ? null : uploadButton}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      );
    }
}
