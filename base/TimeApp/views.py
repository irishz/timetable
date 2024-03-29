from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from TimeApp.models import Item, Lot, Formula
from TimeApp.serializers import ItemSerializer, LotSerializer, MyTokenObtainPairSerailizer, FormulaSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class ItemAPI(APIView):
    @csrf_exempt
    def get(self, request):
        item = Item.objects.all()
        serializer = ItemSerializer(item, many=True)
        return Response(serializer.data)
    def post(self, request):
        data = request.data
        serializer = ItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            res = {'msg': 'สร้างไอเทมสำเร็จ'}
            return Response(res)
        res = {
            'msg': 'ไม่พบข้อมูล'
        }
        json_data = JSONRenderer().render(serializer.errors)
        return HttpResponse(json_data, content_type="application/json")

class ItemDetailAPI(APIView):
    @csrf_exempt
    def get_object(self, id):
        try:
            return Item.objects.get(item_id=id)
        except Item.DoesNotExist:
            res ={'msg': 'ไม่พบข้อมูล'}
            return HttpResponse(res, content_type="application/json")

    def get(self, request, id):
        item = self.get_object(id)
        serializer = ItemSerializer(item)
        return Response(serializer.data)

    def put(self, request, id, format=None):
        item = self.get_object(id)
        serializer = ItemSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'อัพเดทข้อมูลสำเร็จ'})
        res ={'msg': 'ไม่พบข้อมูล'}
        json_data = JSONRenderer().render(res)
        return HttpResponse(json_data, content_type="application/json")

    def delete (self, request, id):
        item = self.get_object(id)
        item.delete()
        return Response({'msg': 'ลบข้อมูลสำเร็จ'})

class LotAPI(APIView):
    @csrf_exempt
    def get(self, request):
        lot = Lot.objects.all()
        serializer = LotSerializer(lot, many=True)
        return Response(serializer.data)
    def post(self, request):
        data = request.data
        serializer = LotSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            res = {'msg': 'สร้าง lot สำเร็จ'}
            return Response(res)
        res = {
            'msg': 'ไม่พบข้อมูล'
        }
        json_data = JSONRenderer().render(serializer.errors)
        return HttpResponse(json_data, content_type="application/json")

class LotDetailAPI(APIView):
    @csrf_exempt
    def get_object(self, id):
        try:
            return Lot.objects.get(id=id)
        except Lot.DoesNotExist:
            res ={'msg': 'ไม่พบข้อมูล'}
            return HttpResponse(res, content_type="application/json")

    def get(self, request, id):
        lot = self.get_object(id)
        serializer = LotSerializer(lot)
        return Response(serializer.data)

    def put(self, request, id):
        lot = self.get_object(id)
        serializer = LotSerializer(lot, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'อัพเดทข้อมูลสำเร็จ'})
        res ={'msg': 'ไม่พบข้อมูล'}
        json_data = JSONRenderer().render(res)
        return HttpResponse(json_data, content_type="application/json")

class LotItemAPI(APIView):
    @csrf_exempt
    def get(self, request, item, format=None):
        lot = Lot.objects.filter(item=item)
        serializer = LotSerializer(lot, many=True)
        # print(serializer.data)
        return Response(serializer.data)
        # return Response(serializer.errors)

    def delete(self, request, item, format=None):
        lot = Lot.objects.filter(item=item).delete()

        return Response({'msg': 'ลบข้อมูลสำเร็จ'})

class FormulaAPI(APIView):
    @csrf_exempt
    def get(self, request):
        formula = Formula.objects.all()
        serializer = FormulaSerializer(formula, many=True)
        return Response(serializer.data)
    def post(self, request):
        data = request.data
        serializer = FormulaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            res = {'msg': 'สร้างสูตรการผลิตสำเร็จ'}
            return Response(res)
        res = {
            'msg': 'ไม่พบข้อมูล'
        }
        json_data = JSONRenderer().render(serializer.errors)
        return HttpResponse(json_data, content_type="application/json")

class FormulaDetailAPI(APIView):
    @csrf_exempt
    def get_object(self, id):
        try:
            return Formula.objects.get(id=id)
        except Formula.DoesNotExist:
            res ={'msg': 'ไม่พบข้อมูล'}
            return HttpResponse(res, content_type="application/json")

    def get(self, request, id):
        formula = self.get_object(id)
        serializer = FormulaSerializer(formula)
        return Response(serializer.data)

    def put(self, request, id, format=None):
        formula = self.get_object(id)
        serializer = FormulaSerializer(formula, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'อัพเดทข้อมูลสำเร็จ'})
        res ={'msg': 'ไม่พบข้อมูล'}
        json_data = JSONRenderer().render(res)
        return HttpResponse(json_data, content_type="application/json")

    def delete (self, request, id):
        formular = self.get_object(id)
        formular.delete()
        return Response({'msg': 'ลบข้อมูลสำเร็จ'})

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerailizer