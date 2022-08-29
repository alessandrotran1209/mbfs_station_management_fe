import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { AuthenService } from '../services/authen.service';
import { SharedService } from '../services/shared.service';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  icon: string;
  children?: FoodNode[];
  is_active: boolean;
  route?: string;
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Trạm',
    icon: 'dashboard',
    is_active: false,
    route: '/station',
  },
  {
    name: 'Công việc',
    icon: 'home',
    is_active: false,
    route: '/operation',
  },
  {
    name: 'Báo cáo',
    icon: 'assignment',
    is_active: false,
    children: [
      {
        name: 'Báo cáo NVVH',
        icon: 'person',
        is_active: false,
        route: '/report/operator',
      },
      {
        name: 'Báo cáo chi tiết',
        icon: 'text_snippet',
        is_active: false,
        route: '/report/overview',
      },
    ],
  },
];
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  ngOnInit(): void {
    this.router.navigate(['/home']);
  }
  title = 'QLCV';
  treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  currentUsername = '';
  usernameSrc: Subject<string>;
  constructor(
    private router: Router,
    private sharedService: SharedService,
    private tokenStorage: TokenStorageService,
    private authService: AuthService
  ) {
    this.dataSource.data = TREE_DATA;

    this.sharedService.data.subscribe((value) => {
      this.currentUsername = value;
    });
  }

  hasChild = (_: number, node: FoodNode) =>
    !!node.children && node.children.length > 0;

  isActive(name: string) {
    for (var data of TREE_DATA) {
      data.is_active = false;
      if (data.name == name) {
        data.is_active = true;
      }
      if (data.children?.length != undefined) {
        for (var child of data.children as FoodNode[]) {
          var cchild = child as unknown as FoodNode;

          cchild.is_active = false;
          if (cchild.name == name) {
            cchild.is_active = true;
          }
        }
      }
    }
  }

  navigate(route: any) {
    this.router.navigate([route]);
  }
  isVisible = false;
  toggleCard() {
    this.isVisible = !this.isVisible;
  }

  logOut() {
    this.isVisible = false;
    this.tokenStorage.signOut();
    this.sharedService.sendData('');
    this.router.navigate(['/login']);
  }

  isAdminOnly(name: any) {
    if (name == 'Báo cáo chi tiết') {
      return this.authService.getDecodedToken().role == 'admin';
    }
    return true;
  }
}
