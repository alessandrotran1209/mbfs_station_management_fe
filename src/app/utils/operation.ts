export class Operation {
  operation: Record<string, any> = {
    '1': {
      value: '1',
      viewValue: 'Xử lý lỗi thiết bị Tủ 2G, 3G và 4G',
    },
    '2': {
      value: '2',
      viewValue:
        'Xử lý lỗi  RRU, lỗi dây quang, lỗi Feeder, Jumper và anten 2G, 3G, 4G',
    },
    '3': {
      value: '3',
      viewValue: 'Xử lý lỗi thiết bị truyền dẫn Viba',
    },
    '4': {
      value: '4',
      viewValue:
        'Xử lý lỗi thiết bị truyền dẫn Quang trong trạm: dây nhảy, CSG, ODF, Modul quang…',
    },
    '5': {
      value: '5',
      viewValue: 'Xử lý lỗi các thiết bị phụ trợ: Cảnh báo ngoài, tủ nguồn,…',
    },
    '6': {
      value: '6',
      viewValue: 'Thực hiện nâng-hạ cấp cấu hình thiết bị theo yêu cầu của MBF',
    },
    '7': {
      value: '7',
      viewValue:
        'Đo kiểm xác định điểm đứt cáp quang, triển khai kéo cáp, hàn nối măng xông và treo măng xông',
    },
    '8': {
      value: '8',
      viewValue: 'Đo kiểm và hiệu chỉnh trống Viba',
    },
    '9': {
      value: '9',
      viewValue: 'Kiểm tra, thay thế dây IF viba',
    },
    '10': {
      value: '10',
      viewValue: 'Đo kiểm, xử lý suy hao cáp..',
    },
    '11': {
      value: '11',
      viewValue: 'Triển khai chạy máy phát điện di động',
    },
    '12': {
      value: '12',
      viewValue: 'Triển khai chạy máy phát điện cố định',
    },
    '13': {
      value: '13',
      viewValue: 'Vệ sinh công nghiệp nhà trạm',
    },
    '14': {
      value: '14',
      viewValue: 'Tiếp nhận, liên hệ khách hàng theo thông tin PA',
    },
    '15': {
      value: '15',
      viewValue: 'Đến hiện trường đo kiểm và phối hợp xác định nguyên nhân',
    },
    '16': {
      value: '16',
      viewValue:
        'Phối hợp hiệu chỉnh anten, lắp đặt và điều chuyển Smallcell, Repeater',
    },
    '17': {
      value: '17',
      viewValue: 'Kiểm tra, cập nhật tuyến cáp định kì',
    },
    '18': {
      value: '18',
      viewValue: 'Bảo dưỡng, căng chùng tuyến cáp nguy cơ mất an toàn..',
    },
    '19': {
      value: '19',
      viewValue:
        'Phối hợp các bên Điện lực, chiếu sáng, quản lý đô thị để thực hiện các công việc liên quan đến cáp trên cột, trong cống bể…',
    },
    '20': {
      value: '20',
      viewValue:
        'Hỗ trợ các đối  tác ra vào trạm, giám sát công việc tại trạm: bảo dưỡng, lắp đặt, thay thế thiết bị, hạ tầng nhà trạm..',
    },
    '21': {
      value: '21',
      viewValue: 'Phối hợp giám sát tuyến cáp Quang',
    },
    '22': {
      value: '22',
      viewValue: 'Tiếp nhận và đóng ticket sự cố trạm quản lý',
    },
    '23': {
      value: '23',
      viewValue: 'Hồ sơ thanh toán tiền điện, thuê nhà trạm',
    },
    '24': {
      value: '24',
      viewValue: 'Công việc khác ….',
    },
  };

  public getOperation(code: any) {
    return this.operation[code];
  }

  public getLength() {
    return Object.keys(this.operation).length;
  }
}
