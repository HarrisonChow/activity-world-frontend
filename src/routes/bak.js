const categories = [{
  value: 'Sports',
  label: 'Sports',
  children: [
    {
      value: 'Soccer',
      label: 'Soccer',
    },
    {
      value: 'Basketball',
      label: 'Basketball',
    },
    {
      value: 'Swimming',
      label: 'Swimming',
    },
    {
      value: 'Tennis',
      label: 'Tennis',
    },
    {
      value: 'Badminton',
      label: 'Badminton',
    }
  ],
}, {
  value: 'Visual arts',
  label: 'Visual arts',
  children: [
    {
      value: 'Drawing',
      label: 'Drawing',
    },
    {
      value: 'Photography',
      label: 'Photography',
    },
    {
      value: 'Sculpture',
      label: 'Sculpture',
    },
    {
      value: 'Sketching',
      label: 'Sketching',
    },
    {
      value: 'Painting',
      label: 'Painting',
    },
    {
      value: 'Printmaking',
      label: 'Printmaking',
    },
    {
      value: 'Advertising',
      label: 'Advertising',
    },
    {
      value: 'Public art',
      label: 'Public art',
    },
    {
      value: 'Screen',
      label: 'Screen',
    },
    {
      value: 'Media arts',
      label: 'Media arts',
    },
    {
      value: 'Design',
      label: 'Design',
    },
    {
      value: 'Multimedia',
      label: 'Multimedia',
    },
    {
      value: 'Craft',
      label: 'Craft',
    }
  ],
}, {
  value: 'Creative industries',
  label: 'Creative industries',
  children: [
    {
      value: 'Architecture',
      label: 'Architecture',
    },
    {
      value: 'Coding',
      label: 'Coding',
    },
    {
      value: 'Industrial design',
      label: 'Industrial design',
    },
    {
      value: 'Game design',
      label: 'Game design',
    },
    {
      value: 'Augmented/virtual reality',
      label: 'Augmented/virtual reality',
    },
    {
      value: 'Graphic design',
      label: 'Graphic design',
    },
    {
      value: 'Fashion design',
      label: 'Fashion design',
    },
    {
      value: 'Radio',
      label: 'Radio',
    }
  ],
}, {
  value: 'Literary and linguistics arts',
  label: 'Literary and linguistics arts',
  children: [
    {
      value: 'Creative writing',
      label: 'Creative writing',
    },
    {
      value: 'Languages',
      label: 'Languages',
    },
    {
      value: 'Publishing',
      label: 'Publishing',
    },
    {
      value: 'Public speaking',
      label: 'Public speaking',
    },
    {
      value: 'Poetry',
      label: 'Poetry',
    }
  ],
}, {
  value: 'Performing arts',
  label: 'Performing arts',
  children: [
    {
      value: 'Music',
      label: 'Music',
    },
    {
      value: 'Drama',
      label: 'Drama',
    },
    {
      value: 'Singing',
      label: 'Singing',
    },
    {
      value: 'Circus arts',
      label: 'Circus arts',
    },
    {
      value: 'Creative expression',
      label: 'Creative expression',
    },
    {
      value: 'Choreography',
      label: 'Choreography',
    },
    {
      value: 'Synchronised swimming',
      label: 'Synchronised swimming',
    },
    {
      value: 'Parkour',
      label: 'Parkour',
    },
    {
      value: 'Theatre',
      label: 'Theatre',
    },
    {
      value: 'Dance',
      label: 'Dance',
      children: [
        {
          value: 'Ballet',
          label: 'Ballet',
        }
      ]
    }
  ],
},{
  value: 'Not found in list',
  label: 'Not found in list',
}];



<FormItem
  {...formItemLayout}
  label="Activity categories"
>
  {getFieldDecorator('category', {
    initialValue: ['Sports', 'Soccer'],
    rules: [{ type: 'array', required: true, message: 'Please select activity course category!' }],
  })(
    <Cascader options={categories} />
  )}
</FormItem>
