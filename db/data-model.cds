namespace my.bookshop;

entity Books {
  key ID : Integer;
  title  : String;
  stock  : Integer;
}

entity Employees {
 key empId :Integer @cds.autoferer;
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
  laptop:Integer;
  mouse:Integer;
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
  // Department:Association to many Departments on Department.Department_Id = $self.Employee_Department_ID;
}


entity Comments {
key commentId:Integer;
empId:Integer;
comment:String;
timestamp: DateTime;
}




