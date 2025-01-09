import React from 'react';
import ActionBar from '../../layouts/ActionsBar';
import { useState, useEffect } from 'react';
import { Table, Space } from 'antd';
import {
  Button as Button_antd,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Select,
  TreeSelect,
  Checkbox, Button ,
  Divider,
  Modal
} from 'antd';
import ProjectTables from '../../components/dashboard/ProjectTable';
import axios from 'axios';
import Swal from 'sweetalert2';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
const People = () => {
  const [view, setView] = useState(true);

  const [titleTxt , setTitleText] = useState()
  const [data, setData] = useState([])
  const [tableLoading, setTableLoading] = useState(true)
  const { confirm } = Modal;
  const handleViewJobs = () => {
  
    setTitleText("View Job Categories")
    console.log('View...');
    setView(true)
    // Add logic to update the table for viewing jobs
  };

  useEffect(() => {

    
        fetchUsers();
   setView(true)
  }, []);


  const handleSubmit = async (formdata) => {
    console.log(formdata)
   
    try {
      const response = await axios.post('http://localhost:5070/api/add_new_user', {
        formdata
      });
      // console.log(response)
      if (!response.status == 200) {
        throw new Error('Failed to insert data');
      }
      if (response.status == 200) {

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Successfully Submitted!",
          showConfirmButton: false,
          timer: 3500
        });
        setView(true)
      }
    } catch (error) {
      console.error('Error inserting data:', error);
      // Handle error appropriately
    }
  };

const getAllData  = async () => {
  Swal.fire({
    position: "bottom-end",
    icon: "info",
    title: "All Data Reecovered",
    showConfirmationButton : true ,
    timer: 5000,
  })
}
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5070/api/users');
      setData(response.data);
      setTableLoading(false)
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };
  const handleAddJob = () => {
    
    setTitleText("Add New Job Category")
    setView(false)
    console.log('Adding...');
    // Add logic to update the table for adding a job
  };
  
  const handleRefresh = () => {
    // Add refresh logic here
    console.log('Refreshing...');
  };


  
//   const handleEdit = (record) => {
//     setView(false)

//     setEditMode(true)

//     console.log(record)
//     localStorage.setItem("RecordID", record.id)
//     // Set form field values
//     form.setFieldsValue({
//         name: record.name,
//         email_addresses: record.email_addresses,
//         mobile_numbers: record.mobile_numbers,
//         points: record.points,
//         skills: record.skills,
//         experience: record.experience,
//         school: record.school,
//         hiring_status: record.status_id,
//         feedback: record.feedback
//     });


// };

const handleDelete = (record) => {
  confirm({
      title: 'Are you sure you want to delete this job?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
         deleteUser(record);
      },
  });
};

const deleteUser = async (record) => {
  console.log(record)
  try {
      const response = await axios.delete(`http://localhost:5070/api/users/${record.user_id}`);

      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "User Deleted Successfully",
         showConfirmButton: false,
          timer: 3500
        });
        fetchUsers()
      } else {
          // Handle other response status codes if needed
          console.error('Failed to delete job:', response.data.error);
      }
  } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error deleting job:', error.message);

      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Can't Delete User",
        text: "Cannot delete user. Existing data linked to this account prevents deletion.",
        showConfirmButton: false,
        timer: 3500
      });
  }
};


const columns = [
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
    },
    ,{
      title: 'Joined Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (createdAt) => new Date(createdAt).toLocaleDateString(),
    },
   
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
          <span>
              {/* <a onClick={() => handleEdit(record)}><EditOutlined /></a> */}
              <Divider type="vertical" />
              <a onClick={() => handleDelete(record)}><DeleteOutlined /></a>
          </span>
      
      ),
    },
  ];
  const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};

  const datas = [
    {
      key: '1',
      title: 'Software Developer',
      company: 'ABC Tech',
      location: 'New York',
      postedDate: '2024-03-09',
    },
    {
      key: '2',
      title: 'UX/UI Designer',
      company: 'XYZ Design',
      location: 'San Francisco',
      postedDate: '2024-03-08',
    },
    // Add more dummy data as needed
  ];
  return (
   <>
   <ActionBar title={"Users"} onViewJobs={handleViewJobs} 
   onAddJob={handleAddJob} onRefresh={handleRefresh} btnName={"View Users"} 
   btnNameEdit={"Add Users"}></ActionBar>
    {
      view ?
      ( <div>
     <Table columns={columns}  dataSource={data} loading={tableLoading}/>
     </div>):(
      <>
     
    <Form
       {...formItemLayout}
       variant="filled"
                        onFinish={handleSubmit}
                        style={{ border: '1px solid #ccc', padding: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
    >
     

      <Form.Item
        label="Username"
        name="username"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Is Admin"
        name="is_admin"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>


      <Form.Item
        label="Is Recruiter"
        name="is_recruiter"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>

     

      <Form.Item  

      wrapperCol={{
                            offset: 6,
                            span: 16,
                          }}>
        <Button type="primary" htmlType="submit" className='btn btn-success' style={{ width: '100%' }}>
          Submit
        </Button>
      </Form.Item>
    </Form>
      </>
     )  
    
    } 
    </>)}
;

export default People;
