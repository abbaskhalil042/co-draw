export default interface UserType extends Express.Request {
  name: string;
  email: string;
  password: string;
  photo?: string;
}
