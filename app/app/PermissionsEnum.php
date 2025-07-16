<?php

namespace App;

enum PermissionsEnum : string
{
    case ApprovreVendor = 'approveVendor';
    case SellProducts = 'SellProducts';    
    case ByProducts = 'ByProducts';    
}