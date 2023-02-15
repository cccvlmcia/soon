import {Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material";

export default function ConfirmDialog({open, setOpen, handleOK}: any) {
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    setOpen(false);
    handleOK();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>회원탈퇴</DialogTitle>
        <DialogContent>
          <DialogContentText>탈퇴하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
          <Button onClick={handleSubmit}>확인</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
