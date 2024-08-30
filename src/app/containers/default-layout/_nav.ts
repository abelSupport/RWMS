import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'Cooker Map',
    url: '/dashboard/cooker',
    iconComponent: { name: 'cil-speedometer' },
  },

  {
    name: 'VTS Cooker Report',
    iconComponent: { name: 'cil-speedometer' },
    children: [
      {
        name: 'Map',
        url: '/dashboard/Vehicledashboard',
        iconComponent: { name: 'cil-chart-line' },
      },
      {
        name: 'Report',
        url: '/dashboard/allcookerstatusdata',
        iconComponent: { name: 'cil-list' },
      },
    ]
  },

  {
    name: 'Master Data',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Roads Master Data',
        url: '/location/list',
        iconComponent: { name: 'cil-chart-line' },
      },
      {
        name: 'Tasks',
        url: '/module/list',
        iconComponent: { name: 'cil-link' },
      },
      {
        name: 'Unit',
        url: '/unit/list',
        iconComponent: { name: 'cil-balance-scale' },
      },
      {
        name: 'User',
        url: '/user/list',
        iconComponent: { name: 'cil-user' },
      },
      {
        name: 'Pothole User',
        url: '/user/potholelist',
        iconComponent: { name: 'cil-user' },
      },
    ],
  },
  {
    name: 'Data Entry Attributes',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Attributes List',
        url: '/location/dataentryassetpandmattributelist',
        iconComponent: { name: 'cil-list' },
      },
      {
        name: 'Attach Attributes',
        url: '/location/dataentrygrouplist',
        iconComponent: { name: 'cil-pin' },
      },
    ],
  },
  {
    name: 'Mega CC Project',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Mega CC Roads',
        url: '/location/megacclist',
        iconComponent: { name: 'cil-chart-line' },
      },
      {
        name: 'Mega CC Roads Map',
        url: '/ol/display',
        iconComponent: { name: 'cil-map' },
    
      },
      {
        name: 'Mega CC Reports',
        iconComponent: { name: 'cil-chart-pie' },
        children: [
          // {
          //   name: 'Date Wise Task Details',
          //   url: '/location/report/taskdetailsreport',
          //   iconComponent: { name: 'cil-chart-line' },
          // },
       
          {
            name: 'Zone Wise Report',
            url: '/location/report/zonewisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Ward Wise Report',
            url: '/location/report/wardwisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Contractor Wise Report',
            url: '/location/report/contractorwisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Road Wise Report',
            url: '/location/report/roadwisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Contractor Remarks',
            url: '/location/report/contractorremarksreport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Defaulter List',
            url: '/location/report/locationdataentry',
            iconComponent: { name: 'cil-chart-line' },
          },
        ],
      },
    
    ]
  },
  {
    name: 'Non Mega CC Roads',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Non Mega CC Roads',
        url: '/location/nonmegacclist',
        iconComponent: { name: 'cil-chart-line' },
      },
      // {
      //   name: 'Mega CC Roads Map',
      //   url: '/ol/display',
      //   iconComponent: { name: 'cil-map' },
    
      // },
      // {
      //   name: 'Mega CC Reports',
      //   iconComponent: { name: 'cil-chart-pie' },
      //   children: [
      //     // {
      //     //   name: 'Date Wise Task Details',
      //     //   url: '/location/report/taskdetailsreport',
      //     //   iconComponent: { name: 'cil-chart-line' },
      //     // },
       
      //     {
      //       name: 'Zone Wise Report',
      //       url: '/location/report/zonewisereport',
      //       iconComponent: { name: 'cil-chart-line' },
      //     },
      //     {
      //       name: 'Ward Wise Report',
      //       url: '/location/report/wardwisereport',
      //       iconComponent: { name: 'cil-chart-line' },
      //     },
      //     {
      //       name: 'Contractor Wise Report',
      //       url: '/location/report/contractorwisereport',
      //       iconComponent: { name: 'cil-chart-line' },
      //     },
      //     {
      //       name: 'Road Wise Report',
      //       url: '/location/report/roadwisereport',
      //       iconComponent: { name: 'cil-chart-line' },
      //     },
      //     {
      //       name: 'Contractor Remarks',
      //       url: '/location/report/contractorremarksreport',
      //       iconComponent: { name: 'cil-chart-line' },
      //     },
      //     {
      //       name: 'Defaulter List',
      //       url: '/location/report/locationdataentry',
      //       iconComponent: { name: 'cil-chart-line' },
      //     },
      //   ],
      // },
    
    ]
  },
  {
    name: 'Bad Patch Work',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Bad Patch Work List',
        url: '/location/masticworklist',
        iconComponent: { name: 'cil-chart-line' },
      },
      {
        name: 'Bad Patch Road List',
        url: '/location/masticroadlist',
        iconComponent: { name: 'cil-chart-line' },
      }
    ]
  },
  {
    name: 'Pothole Work',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Create Pothole Complaint',
        url: '/potholework/gmap',
        iconComponent: { name: 'cil-chart-line' },
      },
      {
        name: 'Pothole Work List',
        url: '/potholework/list',
        iconComponent: { name: 'cil-chart-line' },
      },
    ]
  },
  {
    name: 'Data Entry',
    iconComponent: { name: 'cil-plus' },
    children: [
      {
        name: 'Data Entry',
        url: '/location/createdataentry',
        iconComponent: { name: 'cil-plus' },
      },
    ],
  },
];

export const dataViewer: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'Cooker Map',
    url: '/dashboard/cooker',
    iconComponent: { name: 'cil-speedometer' },
  },
  // {
  //   name: 'VTS Cooker Report',
  //   url: '/dashboard/Vehicledashboard',
  //   iconComponent: { name: 'cil-speedometer' },
  // },

  {
    name: 'Mega CC Project',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Mega CC Roads',
        url: '/location/megacclist',
        iconComponent: { name: 'cil-chart-line' },
      },
      {
        name: 'Mega CC Roads Map',
        url: '/ol/display',
        iconComponent: { name: 'cil-map' },
    
      },
      {
        name: 'Mega CC Reports',
        iconComponent: { name: 'cil-chart-pie' },
        children: [
          // {
          //   name: 'Date Wise Task Details',
          //   url: '/location/report/taskdetailsreport',
          //   iconComponent: { name: 'cil-chart-line' },
          // },
       
          {
            name: 'Zone Wise Report',
            url: '/location/report/zonewisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Ward Wise Report',
            url: '/location/report/wardwisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Contractor Wise Report',
            url: '/location/report/contractorwisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Road Wise Report',
            url: '/location/report/roadwisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Contractor Remarks',
            url: '/location/report/contractorremarksreport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Defaulter List',
            url: '/location/report/locationdataentry',
            iconComponent: { name: 'cil-chart-line' },
          },
        ],
      },
    
    ]
  },
  {
    name: 'Non Mega CC Roads',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Non Mega CC Roads',
        url: '/location/nonmegacclist',
        iconComponent: { name: 'cil-chart-line' },
      },
      // {
      //   name: 'Mega CC Roads Map',
      //   url: '/ol/display',
      //   iconComponent: { name: 'cil-map' },
    
      // },
      // {
      //   name: 'Mega CC Reports',
      //   iconComponent: { name: 'cil-chart-pie' },
      //   children: [
      //     // {
      //     //   name: 'Date Wise Task Details',
      //     //   url: '/location/report/taskdetailsreport',
      //     //   iconComponent: { name: 'cil-chart-line' },
      //     // },
       
      //     {
      //       name: 'Zone Wise Report',
      //       url: '/location/report/zonewisereport',
      //       iconComponent: { name: 'cil-chart-line' },
      //     },
      //     {
      //       name: 'Ward Wise Report',
      //       url: '/location/report/wardwisereport',
      //       iconComponent: { name: 'cil-chart-line' },
      //     },
      //     {
      //       name: 'Contractor Wise Report',
      //       url: '/location/report/contractorwisereport',
      //       iconComponent: { name: 'cil-chart-line' },
      //     },
      //     {
      //       name: 'Road Wise Report',
      //       url: '/location/report/roadwisereport',
      //       iconComponent: { name: 'cil-chart-line' },
      //     },
      //     {
      //       name: 'Contractor Remarks',
      //       url: '/location/report/contractorremarksreport',
      //       iconComponent: { name: 'cil-chart-line' },
      //     },
      //     {
      //       name: 'Defaulter List',
      //       url: '/location/report/locationdataentry',
      //       iconComponent: { name: 'cil-chart-line' },
      //     },
      //   ],
      // },
    
    ]
  },
  {
    name: 'Bad Patch Work',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Bad Patch Work List',
        url: '/location/masticworklist',
        iconComponent: { name: 'cil-chart-line' },
      },
      {
        name: 'Bad Patch Road List',
        url: '/location/masticroadlist',
        iconComponent: { name: 'cil-chart-line' },
      }
    ]
  },
  {
    name: 'Pothole Work',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Pothole Work List',
        url: '/potholework/list',
        iconComponent: { name: 'cil-chart-line' },
      },
    ]
  },
  
];

export const OtherThanAdmin: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'Cooker Map',
    url: '/dashboard/cooker',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'VTS Cooker Report',
    iconComponent: { name: 'cil-speedometer' },
    children: [
      {
        name: 'Map',
        url: '/dashboard/Vehicledashboard',
        iconComponent: { name: 'cil-chart-line' },
      },
      {
        name: 'Report',
        url: '/dashboard/allcookerstatusdata',
        iconComponent: { name: 'cil-list' },
      },
    ]
  },
  
  {
    name: 'Mega CC Project',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Mega CC Roads',
        url: '/location/megacclist',
        iconComponent: { name: 'cil-chart-line' },
      },
      {
        name: 'Mega CC Roads Map',
        url: '/ol/display',
        iconComponent: { name: 'cil-map' },
    
      },
      {
        name: 'Mega CC Reports',
        iconComponent: { name: 'cil-chart-pie' },
        children: [
          {
            name: 'Zone Wise Report',
            url: '/location/report/zonewisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Ward Wise Report',
            url: '/location/report/wardwisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Contractor Wise Report',
            url: '/location/report/contractorwisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Road Wise Report',
            url: '/location/report/roadwisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Contractor Remarks',
            url: '/location/report/contractorremarksreport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Defaulter List',
            url: '/location/report/locationdataentry',
            iconComponent: { name: 'cil-chart-line' },
          },
        ],
      },
    
    ]
  },
  {
    name: 'Non Mega CC Roads',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Non Mega CC Roads',
        url: '/location/nonmegacclist',
        iconComponent: { name: 'cil-chart-line' },
      },
    
    ]
  },
  {
    name: 'Bad Patch Work',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Bad Patch Work List',
        url: '/location/masticworklist',
        iconComponent: { name: 'cil-chart-line' },
      },
      {
        name: 'Bad Patch Road List',
        url: '/location/masticroadlist',
        iconComponent: { name: 'cil-chart-line' },
      }
    ]
  },
  {
    name: 'Pothole Work',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Pothole Work List',
        url: '/potholework/list',
        iconComponent: { name: 'cil-chart-line' },
      },
    ]
  },
  
];

export const OtherThanAdminWithDataEntry: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'Cooker Map',
    url: '/dashboard/cooker',
    iconComponent: { name: 'cil-speedometer' },
  },
  // {
  //   name: 'VTS Cooker Report',
  //   url: '/dashboard/Vehicledashboard',
  //   iconComponent: { name: 'cil-speedometer' },
  // },
  
  {
    name: 'Mega CC Project',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Mega CC Roads',
        url: '/location/megacclist',
        iconComponent: { name: 'cil-chart-line' },
      },
      {
        name: 'Mega CC Roads Map',
        url: '/ol/display',
        iconComponent: { name: 'cil-map' },
    
      },
      {
        name: 'Mega CC Reports',
        iconComponent: { name: 'cil-chart-pie' },
        children: [
          {
            name: 'Zone Wise Report',
            url: '/location/report/zonewisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Ward Wise Report',
            url: '/location/report/wardwisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Contractor Wise Report',
            url: '/location/report/contractorwisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Road Wise Report',
            url: '/location/report/roadwisereport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Contractor Remarks',
            url: '/location/report/contractorremarksreport',
            iconComponent: { name: 'cil-chart-line' },
          },
          {
            name: 'Defaulter List',
            url: '/location/report/locationdataentry',
            iconComponent: { name: 'cil-chart-line' },
          },
        ],
      },
    ]
  },
  {
    name: 'Non Mega CC Roads',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Non Mega CC Roads',
        url: '/location/nonmegacclist',
        iconComponent: { name: 'cil-chart-line' },
      },
    ]
  },
  {
    name: 'Bad Patch Work',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Bad Patch Work List',
        url: '/location/masticworklist',
        iconComponent: { name: 'cil-chart-line' },
      },
      {
        name: 'Bad Patch Road List',
        url: '/location/masticroadlist',
        iconComponent: { name: 'cil-chart-line' },
      }
    ]
  },
  {
    name: 'Pothole Work',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Pothole Work List',
        url: '/potholework/list',
        iconComponent: { name: 'cil-chart-line' },
      },
    ]
  },
  {
    name: 'Data Entry',
    iconComponent: { name: 'cil-plus' },
    children: [
      {
        name: 'Data Entry',
        url: '/location/createdataentry',
        iconComponent: { name: 'cil-plus' },
      },
    ],
  },
];

export const masticWork: INavData[] = [
  {
    name: 'Bad Patch Work',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'List',
        url: '/location/masticworklist',
        iconComponent: { name: 'cil-chart-line' },
      },
   
    ]
  },

];

export const twitterPRO: INavData[] = [
  {
    name: 'Register Twitter Complaint',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Map',
        url: '/potholework/gmap',
        iconComponent: { name: 'cil-map' },
      },
      {
        name: 'Pothole App Users',
        url: '/user/potholelist',
        iconComponent: { name: 'cil-user' },
      },
    ]
  },
];

export const contractor: INavData[] = [
  {
    name: 'Pothole Work',
    iconComponent: { name: 'cil-list-rich' },
    children: [
      {
        name: 'Pothole Work List',
        url: '/potholework/list',
        iconComponent: { name: 'cil-chart-line' },
      },
    ]
  },
];
