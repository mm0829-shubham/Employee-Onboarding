namespace my.bookshop;

entity Books {
  key ID : Integer;
  title  : String;
  stock  : Integer;
}

entity Employees {
 key empId :Integer @cds.autoferer;
  ID:UUID;
  firstName:String;
  lastName:String;
  name:String= firstName || ' ' || lastName;
  mobileNumber:String;
  address:String;
  city:String;
  state:String;
  pincode:String;
  status:String  enum {
  Pending = 'Pending';
  Approve = 'Approve';
  Reject = 'Reject';
  Draft='Draft'
} default 'Pending';
  email:String;
  mmId:String;
  position:String;
  salaryDetails:String;
  laptop:String;
  mouse:String;
  department:String;
  hrStatus:String  enum {
  Pending = 'Pending';
  Approve = 'Approve';
  Reject = 'Reject';
} default 'Pending';
  itStatus:String  enum {
  Pending = 'Pending';
  Approve = 'Approve';
  Reject = 'Reject';
} default 'Pending';
  finStatus:String  enum {
  Pending = 'Pending';
  Approve = 'Approve';
  Reject = 'Reject';
} default 'Pending';
  tlStatus:String  enum {
  Pending = 'Pending';
  Approve = 'Approve';
  Reject = 'Reject';
} default 'Pending';
 empFlowStatus:String  enum {
  Pending = 'Warning';
  Approve = 'Success';
  Reject = 'Error';
} default 'Warning';
 jrHrFlowStatus:String  enum {
  Pending = 'Warning';
  Approve = 'Success';
  Reject = 'Error';
} default 'Warning';
 itFlowStatus:String  enum {
  Pending = 'Warning';
  Approve = 'Success';
  Reject = 'Error';
} default 'Warning';
 finFlowStatus:String  enum {
  Pending = 'Warning';
  Approve = 'Success';
  Reject = 'Error';
} default 'Warning';
 tlFlowStatus:String  enum {
  Pending = 'Warning';
  Approve = 'Success';
  Reject = 'Error';
} default 'Warning';
 hHrFlowStatus:String  enum {
  Pending = 'Warning';
  Approve = 'Success';
  Reject = 'Error';
} default 'Warning';
  // Department:Association to many Departments on Department.Department_Id = $self.Employee_Department_ID;
}


entity Comments {
key commentId:UUID;
empId:Integer;
comment:String;
timestamp: DateTime;
}




