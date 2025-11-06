
from rest_framework.response import Response

class Resp:
    def __init__(self, 
        status: str, 
        status_code: int,
        message: str, 
        data: dict = None
    ):
        self.status = status
        self.status_code = status_code
        self.message = message
        self.data = data if data is not None else {}

    def to_dict(self):
        return {
            "status": self.status,
            "status_code": self.status_code,
            "message": self.message,
            "data": self.data
        } 
        
        
class SendResposne:
    @staticmethod
    def send_response(res: Response):
        if res is None:
            return Resp(
                status= "failed",  
                status_code = 500,
                message= "No response received", 
                data= {}
            ).to_dict()
        
        if res.status_code == 404:
            return Resp(
                status= "failed",
                status_code = res.status_code,
                message= "Resource not found",
                data= {}
            ).to_dict()
        
        if res.status_code == 500:
            return Resp(
                status= "failed",
                status_code = res.status_code,
                message= "Internal server error",
                data= {}
            ).to_dict() 
            
        if res.status_code == 200:
            return Resp(
                status= "success",  
                status_code = res.status_code,
                message= "Request is successful", 
                data= res.json()
            ).to_dict()
                   
        else:
            return Resp(
                status= "failed",  
                status_code = res.status_code,
                message= "Request is not successful", 
                data= res.json()
            ).to_dict()
    